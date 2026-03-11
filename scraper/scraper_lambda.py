import requests
from bs4 import BeautifulSoup
import boto3
import json
import logging
from datetime import datetime, time
import pytz
import os
from botocore.exceptions import ClientError


# --- Structured logging for CloudWatch ---
def log(level: str, event: str, **kwargs):
    print(json.dumps({
        "level": level,
        "event": event,
        "timestamp": datetime.now(pytz.timezone("Europe/Paris")).isoformat(),
        **kwargs
    }))


# Default to WARNING instead of INFO to reduce noise in CloudWatch.
logger = logging.getLogger()
logger.setLevel(logging.WARNING)

# --- Business hours settings ---
paris_time = datetime.now(pytz.timezone("Europe/Paris"))
hour = paris_time.hour
start_hour = int(os.environ.get("BUSINESS_HOURS_START", 8))  # Default to 8 AM
end_hour = int(os.environ.get("BUSINESS_HOURS_END", 17))  # Default to 5 PM


def lambda_handler(event=None, context=None):
    lambda_start = time.monotonic()

    if not (start_hour <= hour <= end_hour):
        log("INFO", "outside_business_hours",
            current_hour=hour,
            window=f"{start_hour}-{end_hour}")
        return

    log("INFO", "scraping_start", hour=hour)

    # Load config
    try:
        with open("config.json") as file:
            config = json.load(file)
        log("INFO", "config_loaded", ticker_count=len(config["symbols"]))

    except Exception as e:
        log("ERROR", "config_load_failed", error=str(e))
        return {"status": "error", "message": "Config loading failed"}

    s3 = boto3.client("s3")
    s3_bucket = config["s3_bucket"]
    s3_prefix = config["s3_prefix"]

    results = []
    success_count = 0
    error_count = 0
    last_entry_count = 0

    for entry in config["symbols"]:
        symbol = entry["symbol"]
        url = entry["url"]
        key = f"{s3_prefix}/{symbol}.json"
        ticker_start = time.monotonic()
        log("INFO", "ticker_start", symbol=symbol)

        # Fetch page
        try:
            response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
            response.raise_for_status()
        except requests.RequestException as e:
            log("ERROR", "fetch_failed", symbol=symbol, error=str(e), duration_ms=int((time.monotonic() - ticker_start) * 1000))
            results.append({symbol: f"Failed to fetch: {e}"})
            error_count += 1
            continue

        # Parse price
        soup = BeautifulSoup(response.text, "html.parser")
        price_tag = soup.find("span", class_=entry["price_selector_class"])
        if not price_tag:
            log("ERROR", "price_tag_not_found", symbol=symbol, selector=entry["price_selector_class"])
            results.append({symbol: "Price tag not found"})
            error_count += 1
            continue

        price = round(float(price_tag.text.strip()), 3)
        timestamp = datetime.now(pytz.timezone("Europe/Paris")).isoformat()
        new_entry = {"timestamp": timestamp, "price": price}

        # Read existing S3 data
        try:
            logger.debug(f"Fetching existing data for {symbol} from S3")
            response_obj = s3.get_object(Bucket=s3_bucket, Key=key)
            existing_data = json.loads(response_obj['Body'].read().decode('utf-8'))
            existing_data = existing_data if isinstance(existing_data, list) else [existing_data]
            existing_data.append(new_entry)
            log("INFO", "s3_read_success", symbol=symbol, existing_entries=len(existing_data) - 1)

        except ClientError as e:
            if e.response["Error"]["Code"] == "NoSuchKey":
                log("INFO", "s3_ticker_new_file", symbol=symbol)
                existing_data = [new_entry]
            else:
                log("ERROR", "s3_read_failed", symbol=symbol, error=str(e))
                results.append({symbol: f"Failed to read S3: {e}"})
                error_count += 1
                continue

            last_entry_count = len(existing_data)

        # Upload updated data to S3
        try:
            s3.put_object(
                Bucket=s3_bucket,
                Key=key,
                Body=json.dumps(existing_data),
                ContentType="application/json"
            )
            duration_ms = int((time.monotonic() - ticker_start) * 1000)
            log("INFO", "ticker_success", symbol=symbol, price=price, total_entries=last_entry_count, duration_ms=duration_ms)
            results.append({symbol: f"Success ({price})"})
            success_count += 1
        except Exception as e:
            log("ERROR", "s3_write_failed", symbol=symbol, error=str(e))
            results.append({symbol: f"Failed to upload: {e}"})
            error_count += 1

    total_ms = int((time.monotonic() - lambda_start) * 1000)
    log("INFO", "scraping_complete", total_tickers=len(results), success_count=success_count, error_count=error_count, duration_ms=total_ms)

    return {
        "status": "success",
        "summary": results,
        "timestamp": timestamp,
        "entry_count": last_entry_count
    }

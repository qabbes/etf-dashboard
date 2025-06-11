import requests
from bs4 import BeautifulSoup
import boto3
import json
import logging
from datetime import datetime
from botocore.exceptions import ClientError

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def lambda_handler(event=None, context=None):
    logger.info("ETF Scraper Lambda function started")
    # Load config
    try:
        with open("config.json") as file:
            config = json.load(file)
        logger.info(
            f"Loaded config with {len(config['symbols'])} tickers to process")
    except Exception as e:
        logger.error(f"Failed to load config: {e}")
        return {"status": "error", "message": "Config loading failed"}

    s3 = boto3.client("s3")
    s3_bucket = config["s3_bucket"]
    s3_prefix = config["s3_prefix"]
    logger.info(f"Using S3 bucket: {s3_bucket}, prefix: {s3_prefix}")

    results = []
    last_entry_count = 0

    for entry in config["symbols"]:
        symbol = entry["symbol"]
        url = entry["url"]
        key = f"{s3_prefix}/{symbol}.json"
        headers = {"User-Agent": "Mozilla/5.0"}
        logger.info(f"Processing ticker: {symbol}, URL: {url}")

        try:
            logger.debug(f"Requesting URL: {url}")
            response = requests.get(url, headers=headers)
            response.raise_for_status()
        except requests.RequestException as e:
            logger.error(f"Failed to fetch {symbol}: {e}")
            results.append({symbol: f"Failed to fetch: {e}"})
            continue

        soup = BeautifulSoup(response.text, "html.parser")
        price_tag = soup.find("span", class_=entry["price_selector_class"])
        if not price_tag:
            logger.error(
                f"Price tag not found for {symbol} "
                f"using selector: {entry['price_selector_class']}")
            results.append({symbol: "Price tag not found"})
            continue

        price = round(float(price_tag.text.strip()), 3)
        timestamp = datetime.now().isoformat()
        logger.info(f"Extracted price for {symbol}: {price}")
        new_entry = {"timestamp": timestamp, "price": price}

        # Try to get existing data
        try:
            logger.debug(f"Fetching existing data for {symbol} from S3")
            response_obj = s3.get_object(Bucket=s3_bucket, Key=key)
            existing_data = json.loads(
                response_obj['Body'].read().decode('utf-8'))
            entries_count = len(existing_data) if isinstance(
                existing_data, list) else 1
            logger.info(
                f"Found existing data for {symbol} with {entries_count} entries")

            # If it's already an array, append to it
            if isinstance(existing_data, list):
                existing_data.append(new_entry)
                logger.debug(
                    f"Appended new entry to existing array for {symbol}")
            else:
                existing_data = [existing_data, new_entry]
                logger.debug(
                    f"Created new array with existing entry and new entry for {symbol}")

            last_entry_count = len(existing_data)

        except ClientError as e:
            if e.response["Error"]["Code"] == "NoSuchKey":
                logger.info(
                    f"No existing data found for {symbol}, creating new array")
                existing_data = [new_entry]
                last_entry_count = 1
            else:
                logger.error(f"Failed to read S3 for {symbol}: {e}")
                results.append({symbol: f"Failed to read S3: {e}"})
                continue

        # Upload updated data back to S3
        try:
            logger.debug(f"Uploading updated data for {symbol} to S3")
            s3.put_object(
                Bucket=s3_bucket,
                Key=key,
                Body=json.dumps(existing_data),
                ContentType="application/json"
            )
            logger.info(f"Successfully updated {symbol} with price: {price}")
            results.append({symbol: f"Success ({price})"})
        except Exception as e:
            logger.error(f"Failed to upload data for {symbol}: {e}")
            results.append({symbol: f"Failed to upload: {e}"})

    logger.info(f"ETF Scraper completed processing {len(results)} tickers")
    return {
        "status": "success",
        "summary": results,
        "timestamp": timestamp,
        "entry_count": last_entry_count
    }

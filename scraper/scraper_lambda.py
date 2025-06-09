import requests
from bs4 import BeautifulSoup
import boto3
import json
from datetime import datetime
from botocore.exceptions import ClientError


def lambda_handler(event=None, context=None):
    # Load config
    with open("config.json") as file:
        config = json.load(file)

    s3 = boto3.client("s3")
    s3_bucket = config["s3_bucket"]
    s3_prefix = config["s3_prefix"]

    results = []
    last_entry_count = 0

    for entry in config["symbols"]:
        symbol = entry["symbol"]
        url = entry["url"]
        key = f"{s3_prefix}/{symbol}.json"
        headers = {"User-Agent": "Mozilla/5.0"}

        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
        except requests.RequestException as e:
            results.append({symbol: f"Failed to fetch: {e}"})
            continue

        soup = BeautifulSoup(response.text, "html.parser")
        price_tag = soup.find("span", class_=entry["price_selector_class"])
        if not price_tag:
            results.append({symbol: "Price tag not found"})
            continue

        price = float(price_tag.text.strip())
        timestamp = datetime.now().isoformat()
        new_entry = {"timestamp": timestamp, "price": price}

        # Try to get existing data
        try:
            response_obj = s3.get_object(Bucket=s3_bucket, Key=key)
            existing_data = json.loads(
                response_obj['Body'].read().decode('utf-8'))

            # If it's already an array, append to it
            if isinstance(existing_data, list):
                existing_data.append(new_entry)
            else:
                existing_data = [existing_data, new_entry]
            last_entry_count = len(existing_data)

        except ClientError as e:
            if e.response["Error"]["Code"] == "NoSuchKey":
                existing_data = []
            else:
                results.append({symbol: f"Failed to read S3: {e}"})
                continue

        # Upload updated data back to S3
        try:
            s3.put_object(
                Bucket=s3_bucket,
                Key=key,
                Body=json.dumps(existing_data),
                ContentType="application/json"
            )
            results.append({symbol: f"Success ({price})"})
        except Exception as e:
            results.append({symbol: f"Failed to upload: {e}"})

    return {
        "status": "success",
        "summary": results,
        "timestamp": timestamp,
        "entry_count": last_entry_count
    }

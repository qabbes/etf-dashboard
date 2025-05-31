import requests
from bs4 import BeautifulSoup
import boto3
import json
from datetime import datetime


def lambda_handler(event=None, context=None):
    # Load config
    with open("config.json") as file:
        config = json.load(file)

    url = config["url"]
    price_testid = config["price_selector_testid"]
    symbol = config["symbol"]
    s3_bucket = config["s3_bucket"]
    s3_prefix = config["s3_prefix"]

    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
    except requests.RequestException as e:
        return {"error": f"Failed to fetch page: {e}"}

    soup = BeautifulSoup(response.text, "html.parser")
    price_tag = soup.find("span", attrs={"data-testid": price_testid})
    if not price_tag:
        return {"error": "Price span not found"}

    price = price_tag.text
    timestamp = datetime.now().isoformat()

    new_data = {
        "timestamp": timestamp,
        "price": price
    }

    # S3 key - one file per symbol
    key = f"{s3_prefix}/{symbol}.json"
    s3 = boto3.client("s3")

    # Try to get existing data
    try:
        existing_data = s3.get_object(Bucket=s3_bucket, Key=key)
        existing_data = json.loads(
            existing_data['Body'].read().decode('utf-8'))

        # If it's already an array, append to it
        if isinstance(existing_data, list):
            existing_data.append(new_data)
        else:
            existing_data = [existing_data, new_data]

    except s3.exceptions.NoSuchKey:
        existing_data = [new_data]
    except Exception as e:
        return {"error": f"Failed to read existing data from S3: {e}"}

    # Upload updated data back to S3
    try:
        s3.put_object(
            Bucket=s3_bucket,
            Key=key,
            Body=json.dumps(existing_data),
            ContentType="application/json"
        )
    except Exception as e:
        return {"error": f"Failed to upload to S3: {e}"}

    return {
        "status": "success",
        "price": price,
        "timestamp": timestamp,
        "s3_key": key,
        "entry_count": len(existing_data)
    }

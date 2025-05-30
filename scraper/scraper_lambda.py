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

    data = {
        "symbol": symbol,
        "price": price,
        "timestamp": timestamp
    }

    s3 = boto3.client("s3")
    key = f"{s3_prefix}/{symbol}-{timestamp}.json"

    try:
        s3.put_object(
            Bucket=s3_bucket,
            Key=key,
            Body=json.dumps(data),
            ContentType="application/json"
        )
    except Exception as e:
        return {"error": f"Failed to upload to S3: {e}"}

    return {
        "status": "success",
        "price": price,
        "timestamp": timestamp,
        "s3_key": key
    }

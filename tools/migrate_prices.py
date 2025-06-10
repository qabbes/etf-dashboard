import boto3
import json
import argparse


def migrate_prices(bucket, key):
    s3 = boto3.client("s3")

    try:
        obj = s3.get_object(Bucket=bucket, Key=key)
        data = json.loads(obj["Body"].read())
    except Exception as e:
        print(f"Failed to fetch {key}: {e}")
        return

    modified = False
    for entry in data:
        if isinstance(entry["price"], str):
            try:
                entry["price"] = float(entry["price"].strip())
                modified = True
            except ValueError:
                print(f"Invalid price format in entry: {entry}")

    if modified:
        s3.put_object(
            Bucket=bucket,
            Key=key,
            Body=json.dumps(data),
            ContentType="application/json"
        )
        print(f"Updated {key}: all prices are now floats")
    else:
        print(
            f"No changes needed for {key} — all prices are already floats")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Migrate ETF price JSON from string to float.")
    parser.add_argument("symbol", help="The ticker symbol (e.g. ESE.PA)")
    parser.add_argument("--bucket", default="scraped-etf-data-qabbes")
    parser.add_argument("--prefix", default="prices")

    args = parser.parse_args()
    key = f"{args.prefix}/{args.symbol}.json"

    migrate_prices(args.bucket, key)

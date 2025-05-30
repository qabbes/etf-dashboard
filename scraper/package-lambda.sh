#!/bin/bash
echo "Packaging Lambda function..."

# Create a deployment package for the Lambda function
rm -rf package scraper_lambda.zip
mkdir -p package

# Install dependencies into the package directory
pip install -r requirements.txt -t package/

# Copy Lambda files to package
cp scraper_lambda.py config.json package/

# Create a zip file for the Lambda function
cd package
zip -r ../scraper_lambda.zip .
cd ..

echo "Lambda function packaged as scraper_lambda.zip"
#!/usr/bin/env sh
GREEN='\033[0;32m'
RESET='\033[0m'  # Reset color

printf "${GREEN}Building function zip...${RESET}\n"
rm -f scraper_lambda.zip
python -m zipfile -c scraper_lambda.zip scraper_lambda.py config.json

printf "${GREEN}Done. scraper_lambda.zip + layer1.zip + layer2.zip ready.${RESET}\n"
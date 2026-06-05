#!/usr/bin/env sh
GREEN='\033[0;32m'
RESET='\033[0m'  # Reset color

printf "${GREEN}Building layer 1 (numpy)...${RESET}\n"
rm -rf layer1 layer1.zip
mkdir -p layer1/python
pip install numpy -t layer1/python/ \
  --platform manylinux2014_x86_64 \
  --only-binary=:all: \
  --python-version 3.11
cd layer1 && python -m zipfile -c ../layer1.zip . && cd ..
rm -rf layer1

printf "${GREEN}Building layer 2 (yfinance + deps)...${RESET}\n"
rm -rf layer2 layer2.zip
mkdir -p layer2/python
pip install yfinance -t layer2/python/ \
  --no-deps \
  --platform manylinux2014_x86_64 \
  --only-binary=:all: \
  --python-version 3.11
pip install requests pytz certifi urllib3 charset-normalizer idna multitasking python-dateutil beautifulsoup4 peewee platformdirs protobuf websockets -t layer2/python/ \
  --platform manylinux2014_x86_64 \
  --only-binary=:all: \
  --python-version 3.11
cd layer2 && python -m zipfile -c ../layer2.zip . && cd ..
rm -rf layer2
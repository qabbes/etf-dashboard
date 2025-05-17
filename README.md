# ETF Dashboard 📈

A full-stack application for tracking and visualizing Exchange-Traded Fund (ETF) data in near real-time. Built to showcase web scraping, cloud infrastructure automation with Terraform, and frontend dashboard design.

## Project Overview

The ETF Dashboard scrapes ETF data from selected sources, stores the data in AWS S3, and displays it in a user-friendly frontend dashboard. The backend is fully serverless, leveraging AWS Lambda, API Gateway, and S3.

## ⚙️ Tech Stack

### Backend   ![Logo](https://raw.githubusercontent.com/weibeld/aws-icons-svg/5e0e14e5472f1eefed879d7ea7e1d79652858d14/q1-2022/Architecture-Service-Icons_01312022/Arch_App-Integration/Arch_16/Arch_Amazon-EventBridge_16.svg) ![Logo](https://raw.githubusercontent.com/weibeld/aws-icons-svg/5e0e14e5472f1eefed879d7ea7e1d79652858d14/q1-2022/Architecture-Service-Icons_01312022/Arch_Compute/16/Arch_AWS-Lambda_16.svg) ![Logo](https://raw.githubusercontent.com/weibeld/aws-icons-svg/5e0e14e5472f1eefed879d7ea7e1d79652858d14/q1-2022/Architecture-Service-Icons_01312022/Arch_Storage/16/Arch_Amazon-Simple-Storage-Service_16.svg)  ![Logo](https://raw.githubusercontent.com/weibeld/aws-icons-svg/5e0e14e5472f1eefed879d7ea7e1d79652858d14/q1-2022/Architecture-Service-Icons_01312022/Arch_App-Integration/Arch_16/Arch_%20Amazon-API-Gateway_16.svg) ![Logo](assets/icons/trfrm24.svg)
- **AWS EventBridge** - Triggers scraping jobs on schedule
- **AWS Lambda** – Python-powered web scraper
- **AWS S3** – Storage for scraped data
- **AWS API Gateway** – Exposes webhooks or endpoints
- **Terraform** – Infrastructure as Code for deployment

### Frontend   ![Logo](https://raw.githubusercontent.com/weibeld/aws-icons-svg/5e0e14e5472f1eefed879d7ea7e1d79652858d14/q1-2022/Architecture-Service-Icons_01312022/Arch_Compute/16/Arch_Amazon-EC2_16.svg) ![Logo](assets/icons/react24.svg)
- **React** – Interactive dashboard UI
- **Hosted on EC2** – Simplified frontend hosting

## Architecture Diagram

![ETF Dashboard Architecture2](assets/archx3.svg)

## Data Flow

1. Lambda scrapes ETF data on a schedule or trigger.
2. Scraped data is saved to an S3 bucket.
3. (Optional) S3 triggers a second Lambda to notify the frontend via webhook or update cache.
4. Frontend dashboard fetches and displays the latest data.


## Project Structure

```
etf-dashboard/
├── bootstrap/                 # For storing tf state and initiate backend S3 setup
│   └── main.tf
├── frontend/                  # React app
├── backend/                   # Lambda functions
│   ├── scraper/               # Python scraper Lambda
│   └── notifier/              # S3-triggered Lambda
├── infrastructure/
│   ├── modules/              # Reusable Terraform modules
│   │   ├── lambda/
│   │   ├── s3/
│   │   ├── eventbridge/
│   │   ├── api_gateway/
│   │   └── ec2/
│   ├── variables.tf          # Global variables
│   ├── outputs.tf            # Global outputs
│   ├── providers.tf          # Provider config (AWS, region, etc.)
│   └── main.tf               # Root module 
├── .gitignore
└── README.md

```

## Getting Started

### Prerequisites
- Terraform installed
- AWS CLI configured
- Node.js & npm/yarn installed (for frontend)

### Setup
## 🛠️ One-time Setup (after clone)
run setup.sh (set your own tracked .githooks)
```bash
bash setup.sh
```
## 🧪 To Do

- [ ]  Add pagination and filtering on frontend
- [ ]  Implement auto-refresh using webhooks or polling
- [ ]  Add authentication (JWT)
- [ ]  Deploy frontend with HTTPS & domain setup (e.g. Route 53 + Caddy/Nginx)

## 📄 License

[MIT License](LICENSE)

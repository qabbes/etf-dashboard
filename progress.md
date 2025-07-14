# 📈 ETF Tracker Project — Progress & Roadmap

This document tracks progress on building a cloud-native ETF tracker using Terraform, AWS (S3, Lambda), and React. The goal is to showcase DevOps, Infra-as-Code, and modern frontend skills.

---

## Core Architecture

- [x] Define initial architecture diagram (S3 → Lambda → DynamoDB → React dashboard)
- [x] Choose tech stack and hosting method
- [x] Define Terraform remote backend (S3 + DynamoDB)
- [x] Create Terraform module structure

---

## Week 1 (Infra Setup Focus)

- [x] Create Terraform backend (S3 + DynamoDB)
- [x] Write provider & backend configuration
- [x] Terraform modules for:
  - [x] S3 bucket to store scraped ETF data
  - [x] Lambda function placeholder
- [x] Initial `terraform plan` + `apply` (non-destructive)

---

## 📦 Week 2 (Lambda + Data Flow)

- [x] Write simple Python Lambda function (dummy data) #TODO
- [x] Write actual scraping script (think about object storage and data structure)
- [x] Configure EventBridge  to trigger Lambda
- [x] Add basic logging + output variables

---

## 🎨 Frontend (Start After Infra MVP)

- [x] Bootstrap React app (Vite or Next.js)
- [x] Setup Tailwind CSS 4
- [x] Fetch data from API / mock bucket
- [x] Display ETF data table
- [x] Create basic dashboard layout
- [ ] Add the possiblity to select ETF to Display

---

## 🌍 Deployment (Optional Phase)

- [x] Host frontend (EC2)
- [x] Secure Lambda with IAM role
- [x] Configure S3 CORS
- [x] Add CI/CD pipeline (GitHub Actions)

---

## 📌 Notes & Ideas

- Use Terraform output to write the EC2 IP to GitHub Secrets automatically (using tools like Terraform Cloud or GitHub’s OIDC auth)
- Automate the update of security group policies for SSH with GitHub Actions IPs before every deploy
- ADD rate limits on S3 fetch or UI throttling

- Webhook-based refresh optional for live updates
- Use CDN in front of S3 for caching OR in memory cache (Redis)

---

_Last updated: 15-06-2025

# 📈 ETF Tracker Project — Progress & Roadmap

This document tracks progress on building a cloud-native ETF tracker using Terraform, AWS (S3, Lambda, DynamoDB), and React. The goal is to showcase DevOps, Infra-as-Code, and modern frontend skills.

---

## ✅ Core Architecture

- [x] Define initial architecture diagram (S3 → Lambda → DynamoDB → React dashboard)
- [x] Choose tech stack and hosting method
- [ ] Define Terraform remote backend (S3 + DynamoDB)
- [ ] Create Terraform module structure

---

## 🔧 Week 1 (Infra Setup Focus)

- [ ] Create Terraform backend (S3 + DynamoDB)
- [ ] Write provider & backend configuration
- [ ] Terraform modules for:
  - [ ] S3 bucket to store scraped ETF data
  - [ ] Lambda function placeholder
  - [ ] DynamoDB table to store structured data
- [ ] Initial `terraform plan` + `apply` (non-destructive)

---

## 📦 Week 2 (Lambda + Data Flow)

- [ ] Write simple Python Lambda function (dummy data)
- [ ] Configure S3 event to trigger Lambda
- [ ] Store results in DynamoDB
- [ ] Add basic logging + output variables
- [ ] Create an `etl/` folder for data processing logic

---

## 🎨 Frontend (Start After Infra MVP)

- [ ] Bootstrap React app (Vite or Next.js)
- [ ] Setup Tailwind CSS 4
- [ ] Fetch data from API / mock bucket
- [ ] Display ETF data table
- [ ] Create basic dashboard layout

---

## 🌍 Deployment (Optional Phase)

- [ ] Host frontend (Netlify / S3 static site / EC2)
- [ ] Secure Lambda with IAM role
- [ ] Configure S3 CORS if needed
- [ ] Add CI/CD pipeline (GitHub Actions)

---

## 📌 Notes & Ideas

- Consider adding an API Gateway + Lambda combo for React to fetch from
- Use S3 Event Notification → Lambda for automatic data ingestion
- Webhook-based refresh optional for live updates

---

_Last updated: 15-05-2025

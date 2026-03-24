#--------- VPC, Subnet & AMI Data Sources ---------#

data "aws_vpc" "default" {
  id = var.vpc_id
}

data "aws_subnet" "default" {
  vpc_id = data.aws_vpc.default.id

  filter {
    name   = "availability-zone"
    values = ["eu-west-3a"]
  }
}

data "aws_ami" "ubuntu_22" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Route53 hosted zone lookup (for domain configuration)
data "aws_route53_zone" "main" {
  name         = "qabbes.me."
  private_zone = false
}

#------- S3, Lambda & Eventbridge modules ----#
module "scraped_etf_data" {
  source      = "./modules/s3"
  bucket_name = "scraped-etf-data-qabbes"

}

module "etf_scraper_lambda" {
  source = "./modules/lambda"
  # The S3 bucket name from the S3 module output
  bucket_name          = module.scraped_etf_data.bucket_name
  business_hours_start = 9
  business_hours_end   = 18
}

module "etf_scraper_eventbridge" {
  source               = "./modules/eventbridge"
  lambda_function_arn  = module.etf_scraper_lambda.lambda_function_arn
  lambda_function_name = module.etf_scraper_lambda.lambda_function_name
}

#----------------- Monitoring module (CloudWatch + SNS) -----------------#
module "monitoring" {
  source          = "./modules/monitoring"
  log_group_name  = module.etf_scraper_lambda.lambda_log_group_name
  lambda_name     = module.etf_scraper_lambda.lambda_function_name
  error_threshold = var.error_threshold
  time_limit_ms   = var.time_limit_ms
  alert_email     = var.alert_email
}

#----------------- Static Website Hosting ---------------#

# S3 bucket for static website hosting
module "frontend_website" {
  source      = "./modules/s3-static-website"
  bucket_name = "etf-dashboard-frontend-qabbes"
}

# CloudFront distribution for the website
module "frontend_cdn" {
  source                         = "./modules/cloudfront"
  bucket_name                    = module.frontend_website.bucket_name
  s3_bucket_arn                  = module.frontend_website.bucket_arn
  s3_bucket_regional_domain_name = module.frontend_website.bucket_regional_domain_name
  
  # Custom domain configuration (enabled for etf-tracker.qabbes.me)
  domain_name         = var.frontend_domain_name
  acm_certificate_arn = module.frontend_certificate.certificate_arn
}

# GitHub OIDC for secure deployments (no static AWS credentials needed)
module "github_oidc" {
  source                      = "./modules/github-oidc"
  github_repo                 = var.github_repo
  github_branch               = "main"
  s3_bucket_arn               = module.frontend_website.bucket_arn
  cloudfront_distribution_arn = module.frontend_cdn.cloudfront_arn
}

# ===== CUSTOM DOMAIN SETUP =====
# # ACM certificate for custom domain (us-east-1 for CloudFront)
 module "frontend_certificate" {
   source = "./modules/acm"
   providers = {
     aws.us_east_1 = aws.us_east_1
   }
   domain_name      = var.frontend_domain_name
   route53_zone_id  = data.aws_route53_zone.main.zone_id
 }

# # Route53 record to point domain to CloudFront
 resource "aws_route53_record" "frontend" {
   zone_id = data.aws_route53_zone.main.zone_id
   name    = var.frontend_domain_name
   type    = "A"

   alias {
     name                   = module.frontend_cdn.cloudfront_domain_name
     zone_id                = module.frontend_cdn.cloudfront_hosted_zone_id
     evaluate_target_health = false
   }
 }

#----------------- EC2 module (DEPRECATED) ---------------#

# locals {
#   subnet_id = data.aws_subnet.default.id
# }

# module "ec2_frontend" {
#   source        = "./modules/ec2"
#   ami           = data.aws_ami.ubuntu_22.id
#   instance_type = "t3.micro"
#   key_name      = var.key_name
#   vpc_id        = data.aws_vpc.default.id
#   subnet_id     = local.subnet_id
#   my_ip_cidr    = var.my_ip_cidr
#   sg_name       = var.sg_name
#   project       = var.project

#   repo_url = var.repo_url
#   app_path = var.app_path
# }
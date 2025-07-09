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

#----------------- EC2 module  ---------------#
locals {
  subnet_id = data.aws_subnet.default.id
}

module "ec2_frontend" {
  source        = "./modules/ec2"
  ami           = data.aws_ami.ubuntu_22.id
  instance_type = "t3.micro"
  key_name      = var.key_name
  vpc_id        = data.aws_vpc.default.id
  subnet_id     = local.subnet_id
  my_ip_cidr    = var.my_ip_cidr
  sg_name       = var.sg_name
  project       = var.project


  repo_url = var.repo_url
  app_path = var.app_path
}
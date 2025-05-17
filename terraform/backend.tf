terraform {
  required_version = ">= 1.11.0"

  backend "s3" {
    bucket       = "etf-tracker-tf-state-bucket-qabbes"
    key          = "global/terraform.tfstate"
    region       = "eu-west-3"
    encrypt      = true
    use_lockfile = true
  }
}
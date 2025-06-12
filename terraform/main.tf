module "scraped_etf_data" {
  source      = "./modules/s3"
  bucket_name = "scraped-etf-data-qabbes"

}

module "etf_scraper_lambda" {
  source = "./modules/lambda"
  # The S3 bucket name from the S3 module output
  bucket_name = module.scraped_etf_data.bucket_name
  business_hours_start = 9
  business_hours_end = 18
}

module "etf_scraper_eventbridge" {
  source               = "./modules/eventbridge"
  lambda_function_arn  = module.etf_scraper_lambda.lambda_function_arn
  lambda_function_name = module.etf_scraper_lambda.lambda_function_name
}
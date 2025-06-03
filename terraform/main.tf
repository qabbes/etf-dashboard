module "scraped_etf_data" {
  source      = "./modules/s3"
  bucket_name = "scraped-etf-data-qabbes"

}

module "etf_scraper_lambda" {
  source = "./modules/lambda"
  # The S3 bucket name from the S3 module output
  bucket_name = module.scraped_etf_data.bucket_name
}

module "etf_scraper_eventbridge" {
  source               = "./modules/eventbridge"
  lambda_function_arn  = module.etf_scraper_lambda.lambda_function_arn
  lambda_function_name = module.etf_scraper_lambda.lambda_function_name
  # change the schedule here if needed
  #schedule_hours      = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17]

}
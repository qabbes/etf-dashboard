variable "lambda_function_name" {
  default = "etf_scraper_lambda"
}
variable "handler" {
  default = "scraper_lambda.lambda_handler"
}
variable "runtime" {
  default = "python3.11"
}
variable "timeout" {
  default = 30
}
variable "memory_size" {
  default = 128
}
variable "bucket_name" {
  description = "The name of the S3 bucket to store scraped ETF data"
  type        = string
}
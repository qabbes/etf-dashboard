variable "lambda_function_name" {
  default = "scraper_lambda"
}
variable "handler" {
  default = "lambda_function.lambda_handler"
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
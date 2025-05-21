variable "lambda_function_name" {
  default = "scrappr_lambda"
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

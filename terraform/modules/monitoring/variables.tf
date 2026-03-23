variable "log_group_name" {
  description = "The name of the CloudWatch log group"
  type        = string
  
}

variable "lambda_name" {
  description = "The name of the Lambda function to monitor"
  type        = string
  
}

variable "error_threshold" {
  description = "The threshold for triggering an alert (e.g., error count)"
  type        = number
  default     = 1
}

variable "time_limit_ms" {
    description = "The execution time limit for the lambda function in milliseconds"
    type        = number
    default     = 15000
}

variable "alert_email" {
  description = "The email address to receive alerts"
  type        = string
}
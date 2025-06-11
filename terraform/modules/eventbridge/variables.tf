variable "lambda_function_arn" {
  description = "ARN of the Lambda function to trigger"
  type        = string
}

variable "lambda_function_name" {
  description = "Name of the Lambda function to trigger"
  type        = string
}

variable "schedule_hours" {
  description = "List of hours (in 24h format) to schedule the Lambda function on weekdays"
  type        = list(number)
  default = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15] # UTC equivalents of 08–17 CEST To be changed during DST
}

variable "schedule_minutes" {
  description = "Minutes of the hour to schedule the Lambda function"
  type        = number
  default     = 0
}

variable "schedule_days" {
  description = "Days to schedule the Lambda function (e.g., MON-FRI)"
  type        = string
  default     = "MON-FRI"
}
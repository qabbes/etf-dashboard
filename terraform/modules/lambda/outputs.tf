output "lambda_function_arn" {
  value       = aws_lambda_function.scraper_lambda.arn
}

output "lambda_function_name" {
  value       = aws_lambda_function.scraper_lambda.function_name
}

output "lambda_log_group_name" {
  value       = aws_cloudwatch_log_group.this.name
}
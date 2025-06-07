output "lambda_function_arn" {
  value       = aws_lambda_function.scraper_lambda.arn
}

output "lambda_function_name" {
  value       = aws_lambda_function.scraper_lambda.function_name
}
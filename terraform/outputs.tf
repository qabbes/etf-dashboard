# S3 Static Website Hosting Outputs
output "s3_website_endpoint" {
  description = "S3 website endpoint URL"
  value       = module.frontend_website.website_endpoint
}

output "s3_bucket_name" {
  description = "Name of the frontend hosting S3 bucket"
  value       = module.frontend_website.bucket_name
}

# CloudFront Outputs
output "cloudfront_url" {
  description = "CloudFront distribution URL (use this to access your website)"
  value       = "https://${module.frontend_cdn.cloudfront_domain_name}"
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID (needed for cache invalidation)"
  value       = module.frontend_cdn.cloudfront_distribution_id
}

# GitHub OIDC Outputs
output "github_actions_role_arn" {
  description = "IAM role ARN for GitHub Actions (add this to GitHub secrets as AWS_ROLE_ARN)"
  value       = module.github_oidc.github_actions_role_arn
}

# Lambda & S3 Data Bucket Outputs
output "lambda_function_name" {
  description = "Name of the ETF scraper Lambda function"
  value       = module.etf_scraper_lambda.lambda_function_name
}

output "data_bucket_name" {
  description = "Name of the scraped ETF data bucket"
  value       = module.scraped_etf_data.bucket_name
}

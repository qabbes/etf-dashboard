variable "role_name" {
  description = "Name of the IAM role for GitHub Actions"
  type        = string
  default     = "GitHubActionsDeploymentRole"
}

variable "github_repo" {
  description = "GitHub repository in format: owner/repo (e.g., username/etf-dashboard)"
  type        = string
}

variable "github_branch" {
  description = "GitHub branch allowed to deploy (typically 'main')"
  type        = string
  default     = "main"
}

variable "s3_bucket_arn" {
  description = "ARN of the S3 bucket for frontend deployment"
  type        = string
}

variable "cloudfront_distribution_arn" {
  description = "ARN of the CloudFront distribution"
  type        = string
}

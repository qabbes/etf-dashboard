variable "project" {
  description = "Project name for resource tagging"
  type        = string
  default     = "etf-tracker"
}

# EC2-related variables (DEPRECATED - only needed if EC2 module is uncommented)
variable "key_name" {
  description = "SSH key pair name"
  type        = string
  default     = ""
}

variable "my_ip_cidr" {
  description = "IP address in CIDR notation for SSH access"
  type        = string
  default     = "0.0.0.0/0"
}

variable "sg_name" {
  description = "Name of the security group"
  type        = string
  default     = "etf-tracker-sg"
}

variable "repo_url" {
  description = "GitHub repository URL for the frontend project"
  type        = string
  default     = ""
}

variable "app_path" {
  description = "Path on the EC2 instance to clone the frontend app into"
  type        = string
  default     = "/home/ubuntu/etf-tracker"
}

variable "vpc_id" {
  description = "The ID of the VPC to deploy into"
  type        = string
}

# GitHub repository configuration for OIDC
variable "github_repo" {
  description = "GitHub repository in format: owner/repo"
  type        = string
}

# ===== Domain and DNS configuration =====
# Route53 zone is looked up automatically via data source in main.tf
variable "frontend_domain_name" {
  description = "Domain name for the frontend (e.g., etf-tracker.qabbes.me)"
  type        = string
  default     = "etf-tracker.qabbes.me"
}
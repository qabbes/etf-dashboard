variable "sg_name" {
  description = "Name of the security group"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}
variable "ami_id" {
  description = "AMI ID for EC2 instance"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "subnet_id" {
  description = "Subnet ID"
  type        = string
}

variable "key_name" {
  description = "SSH key pair name"
  type        = string
}

variable "my_ip_cidr" {
  description = "IP address in CIDR notation for SSH access"
  type        = string
}

variable "repo_url" {
  description = "GitHub repository URL for the frontend project"
  type        = string
}

variable "app_path" {
  description = "Path on the EC2 instance to clone the frontend app into"
  type        = string
}

variable "project" {
  description = "Project name used for tagging resources"
  type        = string
}
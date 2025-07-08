variable "project" {
  description = "Project name for resource tagging"
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
variable "sg_name" {
  description = "Name of the security group"
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
variable "vpc_id" {
  description = "The ID of the VPC to deploy into"
  type        = string
}
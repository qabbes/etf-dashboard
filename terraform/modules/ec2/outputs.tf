output "ec2_instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.frontend.id
}

output "ec2_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_eip.frontend_eip.public_ip
}

output "security_group_id" {
  description = "Security Group ID assigned to EC2"
  value       = aws_security_group.ec2_sg.id
}
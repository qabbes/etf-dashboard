output "event_rule_arns" {
  description = "ARNs of the CloudWatch Event Rules created"
  value       = [for rule in aws_cloudwatch_event_rule.lambda_trigger : rule.arn]
}

output "schedule_count" {
  description = "Number of schedules created"
  value       = length(var.schedule_hours)
}
output "event_rule_arns" {
  description = "ARN of the CloudWatch Event Rules created"
  value       =  aws_cloudwatch_event_rule.lambda_trigger.arn
}

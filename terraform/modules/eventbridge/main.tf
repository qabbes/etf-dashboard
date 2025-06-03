locals {
  # Map of all scheduled hours for use with for_each
  schedule_map = {
    for hour in var.schedule_hours : 
    hour => format("cron(%d %d ? * %s *)", var.schedule_minutes, hour, var.schedule_days)
  }
}
# Create EventBridge rules for each scheduled hour
resource "aws_cloudwatch_event_rule" "lambda_trigger" {
  for_each            = local.schedule_map
  name                = "lambda-trigger-${each.key}h"
  schedule_expression = each.value
}

# Create EventsBridge target for each rule
resource "aws_cloudwatch_event_target" "lambda_target" {
  for_each  = local.schedule_map
  rule      = aws_cloudwatch_event_rule.lambda_trigger[each.key].name
  target_id = "lambda-target-${each.key}h"
  arn       = var.lambda_function_arn
}

# Create all EventsBridge permissions using for_each
resource "aws_lambda_permission" "allow_eventbridge" {
  for_each      = local.schedule_map
  statement_id  = "AllowExecutionFromEventBridge-${each.key}h"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.lambda_trigger[each.key].arn
}
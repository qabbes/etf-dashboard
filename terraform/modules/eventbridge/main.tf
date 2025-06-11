
# Create EventBridge rules for scheduled hours
resource "aws_cloudwatch_event_rule" "lambda_trigger" {
  name                = "lambda-trigger"
  schedule_expression = "cron(0 * ? * MON-FRI *)" # every hour, weekdays
}

# Create EventsBridge target for rule
resource "aws_cloudwatch_event_target" "lambda_target" {
  rule      = aws_cloudwatch_event_rule.lambda_trigger.name
  target_id = "lambda-target"
  arn       = var.lambda_function_arn
}

# Create all EventsBridge permissions using for_each
resource "aws_lambda_permission" "allow_eventbridge" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.lambda_trigger.arn
}
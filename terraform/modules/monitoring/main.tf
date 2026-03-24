#----------------- CloudWatch Log Metric Filters -----------------#

resource "aws_cloudwatch_log_metric_filter" "etf_scraper_errors" {
  name           = "ScraperErrorCount"
  pattern        = "{ $.event = \"scraping_complete\" }"
  log_group_name = var.log_group_name

  metric_transformation {
    name      = "ScraperErrorCount"
    namespace = "etf-scraper"
    value     = "$.error_count"
  }
}

resource "aws_cloudwatch_log_metric_filter" "etf_scraper_duration" {
  name           = "ScraperDuration"
  pattern        = "{ $.event = \"scraping_complete\" }"
  log_group_name = var.log_group_name

  metric_transformation {
    name      = "ScraperDuration"
    namespace = "etf-scraper"
    value     = "$.duration_ms"
  }
}

resource "aws_cloudwatch_log_metric_filter" "etf_success_count" {
  name           = "ScraperSuccessCount"
  pattern        = "{ $.event = \"scraping_complete\" }"
  log_group_name = var.log_group_name

  metric_transformation {
    name      = "ScraperSuccessCount"
    namespace = "etf-scraper"
    value     = "$.success_count"
  } 
}

#----------------- SNS topic and subscription for alerts -----------------#

resource "aws_sns_topic" "etf_scraper_alerts" {
  name = "etf-scraper-alerts"
}

resource "aws_sns_topic_subscription" "etf_scraper_alerts_email_target" {
  topic_arn = aws_sns_topic.etf_scraper_alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email
}

#----------------- CloudWatch Alarms -----------------#

resource "aws_cloudwatch_metric_alarm" "error_count_alarm" {
  alarm_name          = "ScraperErrorCountAlarm"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  alarm_description   = "Alarm when scraper error count exceeds threshold"
  metric_name = "ScraperErrorCount" # can also be referned as aws_cloudwatch_log_metric_filter.etf_scraper_errors.metric_transformation[0].name
  namespace   = "etf-scraper"
  period = 3600
  statistic = "Sum"
  threshold   = var.error_threshold
  alarm_actions = [aws_sns_topic.etf_scraper_alerts.arn] # topic to send alert to
}

resource "aws_cloudwatch_metric_alarm" "scraper_duration_alarm" {
  alarm_name          = "ScraperDurationAlarm"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  alarm_description   = "Alarm when scraper duration exceeds threshold"
  metric_name = "ScraperDuration"
  namespace   = "etf-scraper"
  period = 3600
  statistic = "Maximum"
  threshold   = var.time_limit_ms
  alarm_actions = [aws_sns_topic.etf_scraper_alerts.arn]
}
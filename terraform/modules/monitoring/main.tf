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

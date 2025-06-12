resource "aws_s3_bucket" "scraped_etf_data" {
    bucket = var.bucket_name
    force_destroy = true
}
resource "aws_s3_bucket_cors_configuration" "cors" {
  bucket = aws_s3_bucket.scraped_etf_data.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET"]
    allowed_origins = ["http://localhost:5173"] //TODO: Change for production
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}
 resource "aws_s3_bucket_server_side_encryption_configuration" "sse" {
  bucket = aws_s3_bucket.scraped_etf_data.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
  
}

resource "aws_s3_bucket_policy" "allow_readonly_access_for_prices" {
  bucket = aws_s3_bucket.scraped_etf_data.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid: "AllowPublicReadOnlyForPrices",
        Effect = "Allow",
        Principal = "*",
        Action = "s3:GetObject",
        Resource = "${aws_s3_bucket.scraped_etf_data.arn}/prices/*"
      }
    ]
  })
}

resource "aws_s3_bucket_public_access_block" "public_access" {
  bucket = aws_s3_bucket.scraped_etf_data.id
  block_public_acls       = true
  block_public_policy     = false
  ignore_public_acls      = true
  restrict_public_buckets = false
}
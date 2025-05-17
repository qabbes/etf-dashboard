resource "aws_s3_bucket" "scraped_etf_data" {
    bucket = var.bucket_name
    force_destroy = true
    
}
 resource "aws_s3_bucket_server_side_encryption_configuration" "sse" {
  bucket = aws_s3_bucket.scraped_etf_data.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
  
}
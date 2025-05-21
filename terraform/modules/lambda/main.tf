data "archive_file" "scraper_zip_file" {
    type = "zip"
    source_dir = "${path.module}/../../scraper"
    output_path = "${path.module}/../../scraper/scraper_lambda.zip"
}

resource "aws_iam_role" "lambda_role" {
    name = "lambda_role"
    assume_role_policy = file("${path.module}/policies/lambda-policy.json")
}  

resource "aws_iam_policy" "s3_access_policy" {
  name        = "lambda_s3_etf_data_access"
  description = "Allows Lambda to read, write and list objects in the ETF data bucket"
  policy      = file("${path.module}/policies/s3-access-policy.json")
}

# Attach the AWSLambdaBasicExecutionRole policy to the Lambda role
resource "aws_iam_role_policy_attachment" "lambda_execution_role_attachment" {
    role       = aws_iam_role.lambda_role.name
    policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  
}

# Attach the S3 access policy to the Lambda role
resource "aws_iam_role_policy_attachment" "lambda_s3_policy_attachment" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.s3_access_policy.arn
}

# Create the Lambda function
resource "aws_lambda_function" "scraper_lambda" {
  function_name     = var.lambda_function_name
  handler           = var.handler
  runtime           = var.runtime
  role              = aws_iam_role.lambda_role.arn
  filename          = data.archive_file.scraper_zip_file.output_path
  source_code_hash  = data.archive_file.scraper_zip_file.output_base64sha256
  timeout           = var.timeout
  memory_size       = var.memory_size

  environment {
    variables = {
      BUCKET_NAME = "scraped-etf-data-qabbes"
    }
  }
}
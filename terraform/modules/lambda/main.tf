resource "null_resource" "lambda_dependencies" {
  triggers = {
    # Re-run when the Lambda code changes
    source_code_hash = filemd5("${path.module}/../../../scraper/scraper_lambda.py")
    requirements_hash = filemd5("${path.module}/../../../scraper/requirements.txt")
  }

  provisioner "local-exec" {
    command = "cd ${path.module}/../../../scraper && bash package-lambda.sh"
    interpreter = ["bash", "-c"]
  }
}

# Wait for zip file to be created before calculating hash
resource "null_resource" "lambda_zip_waiter" {
  depends_on = [null_resource.lambda_dependencies]

  # This resource exists only to create a dependency chain
  triggers = {
    # Always run after lambda_dependencies
    dependency_id = null_resource.lambda_dependencies.id
  }
}

locals {
  # Only calculate this after the zip file exists
  lambda_zip_path = "${path.module}/../../../scraper/scraper_lambda.zip"
  source_code_hash = null_resource.lambda_zip_waiter.id != "" ? filebase64sha256(local.lambda_zip_path) : ""
}

resource "aws_iam_role" "lambda_role" {
  name               = "lambda_role"
  assume_role_policy = file("${path.module}/policies/lambda-policy.json")
}
#
resource "aws_iam_policy" "s3_access_policy" {
  name        = "lambda_s3_etf_data_access"
  description = "Allows Lambda to read, write and list objects in the ETF data bucket"
  
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:ListBucket",
          "s3:DeleteObject"
        ],
        Resource = [
          "arn:aws:s3:::${var.bucket_name}",
          "arn:aws:s3:::${var.bucket_name}/*"
        ]
      }
    ]
  })
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

# Create the scraper Lambda function
resource "aws_lambda_function" "scraper_lambda" {
  function_name    = var.lambda_function_name
  handler          = var.handler
  runtime          = var.runtime
  role             = aws_iam_role.lambda_role.arn
  filename         = local.lambda_zip_path
  source_code_hash = local.source_code_hash
  timeout          = var.timeout
  memory_size      = var.memory_size

  environment {
    variables = {
      BUCKET_NAME = var.bucket_name
    }
  }
  depends_on = [
    null_resource.lambda_dependencies,
    aws_iam_role_policy_attachment.lambda_execution_role_attachment,
    aws_iam_role_policy_attachment.lambda_s3_policy_attachment
  ]
}
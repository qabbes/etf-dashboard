# GitHub OIDC Provider for AWS
resource "aws_iam_openid_connect_provider" "github" {
  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1", "1c58a3a8518e8759bf075b76b750d4f2df264fcd"]

  tags = {
    Name = "GitHub Actions OIDC Provider"
  }
}

# IAM role for GitHub Actions
resource "aws_iam_role" "github_actions" {
  name               = var.role_name
  assume_role_policy = data.aws_iam_policy_document.github_actions_assume_role.json

  tags = {
    Name = "GitHub Actions Deployment Role"
  }
}

# Trust policy allowing GitHub Actions to assume the role
data "aws_iam_policy_document" "github_actions_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github.arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      # Format: repo:OWNER/REPO:ref:refs/heads/BRANCH
      values = ["repo:${var.github_repo}:ref:refs/heads/${var.github_branch}"]
    }
  }
}

# IAM policy for S3 and CloudFront access
resource "aws_iam_role_policy" "github_actions_deployment" {
  name   = "DeploymentPermissions"
  role   = aws_iam_role.github_actions.id
  policy = data.aws_iam_policy_document.deployment_permissions.json
}

data "aws_iam_policy_document" "deployment_permissions" {
  # S3 permissions for frontend bucket
  statement {
    effect = "Allow"
    actions = [
      "s3:PutObject",
      "s3:GetObject",
      "s3:DeleteObject",
      "s3:ListBucket"
    ]
    resources = [
      var.s3_bucket_arn,
      "${var.s3_bucket_arn}/*"
    ]
  }

  # CloudFront cache invalidation
  statement {
    effect = "Allow"
    actions = [
      "cloudfront:CreateInvalidation",
      "cloudfront:GetInvalidation"
    ]
    resources = [var.cloudfront_distribution_arn]
  }
}

#!/usr/bin/env bash
#
# Deploy the Razorpay Magic Checkout Lambdas (proxy + webhook) with public
# Function URLs. Re-runnable: if a function already exists it updates the code
# and config instead of failing. Prints the Proxy URL + Webhook URL at the end.
#
# Prereqs: awscli v2 configured (`aws configure`), zip, an existing Lambda
# execution role (any role with the AWSLambdaBasicExecutionRole policy).
#
# Required env vars:
#   AWS_REGION          e.g. ap-south-1
#   LAMBDA_ROLE_ARN     arn:aws:iam::<acct-id>:role/<lambda-exec-role>
#   RZP_KEY_ID          rzp_live_… (or rzp_test_… while testing)
#   RZP_WEBHOOK_SECRET  strong random string (also set on the Razorpay webhook)
# Optional:
#   ALLOWED_ORIGINS     CSV of origins for the proxy (defaults baked into index.js)
#
# Example:
#   AWS_REGION=ap-south-1 \
#   LAMBDA_ROLE_ARN=arn:aws:iam::123456789012:role/optimist-lambda-exec \
#   RZP_KEY_ID=rzp_live_xxxxxxxxxxxx \
#   RZP_WEBHOOK_SECRET=$(openssl rand -hex 32) \
#   ./scripts/deploy-razorpay-lambdas.sh

set -euo pipefail

: "${AWS_REGION:?set AWS_REGION (e.g. ap-south-1)}"
: "${LAMBDA_ROLE_ARN:?set LAMBDA_ROLE_ARN}"
: "${RZP_KEY_ID:?set RZP_KEY_ID}"
: "${RZP_WEBHOOK_SECRET:?set RZP_WEBHOOK_SECRET}"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RUNTIME="nodejs20.x"

deploy_fn() {
  local name="$1" dir="$2" env_json="$3"
  echo "── $name ───────────────────────────────────────────────"
  ( cd "$dir" && rm -f function.zip && zip -q function.zip index.js )

  if aws lambda get-function --function-name "$name" --region "$AWS_REGION" >/dev/null 2>&1; then
    echo "  updating code…"
    aws lambda update-function-code --function-name "$name" \
      --zip-file "fileb://$dir/function.zip" --region "$AWS_REGION" >/dev/null
    aws lambda wait function-updated --function-name "$name" --region "$AWS_REGION"
    echo "  updating config…"
    aws lambda update-function-configuration --function-name "$name" \
      --timeout 15 --environment "$env_json" --region "$AWS_REGION" >/dev/null
    aws lambda wait function-updated --function-name "$name" --region "$AWS_REGION"
  else
    echo "  creating function…"
    aws lambda create-function --function-name "$name" \
      --runtime "$RUNTIME" --handler index.handler \
      --zip-file "fileb://$dir/function.zip" --role "$LAMBDA_ROLE_ARN" \
      --timeout 15 --environment "$env_json" --region "$AWS_REGION" >/dev/null
    aws lambda wait function-active --function-name "$name" --region "$AWS_REGION"
  fi

  if ! aws lambda get-function-url-config --function-name "$name" --region "$AWS_REGION" >/dev/null 2>&1; then
    echo "  creating public Function URL…"
    aws lambda create-function-url-config --function-name "$name" \
      --auth-type NONE --region "$AWS_REGION" >/dev/null
    aws lambda add-permission --function-name "$name" \
      --action lambda:InvokeFunctionUrl --principal "*" \
      --function-url-auth-type NONE --statement-id PublicInvoke \
      --region "$AWS_REGION" >/dev/null 2>&1 || true
  fi

  aws lambda get-function-url-config --function-name "$name" \
    --region "$AWS_REGION" --query FunctionUrl --output text
}

# Build env JSON (JSON form so a comma-separated ALLOWED_ORIGINS is one value).
PROXY_ENV="{\"Variables\":{\"RZP_KEY_ID\":\"$RZP_KEY_ID\""
if [ -n "${ALLOWED_ORIGINS:-}" ]; then
  PROXY_ENV="$PROXY_ENV,\"ALLOWED_ORIGINS\":\"$ALLOWED_ORIGINS\""
fi
PROXY_ENV="$PROXY_ENV}}"
WEBHOOK_ENV="{\"Variables\":{\"RZP_KEY_ID\":\"$RZP_KEY_ID\",\"RZP_WEBHOOK_SECRET\":\"$RZP_WEBHOOK_SECRET\"}}"

PROXY_URL="$(deploy_fn razorpay-magic-proxy "$ROOT/docs/razorpay-proxy" "$PROXY_ENV")"
WEBHOOK_URL="$(deploy_fn razorpay-magic-webhook "$ROOT/docs/razorpay-webhook" "$WEBHOOK_ENV")"

# Trim trailing slash from the proxy URL (frontend appends /v1/...).
PROXY_URL="${PROXY_URL%/}"

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  DONE. Use these values:"
echo ""
echo "  NEXT_PUBLIC_RAZORPAY_PROXY_URL = $PROXY_URL"
echo "  Razorpay webhook URL           = $WEBHOOK_URL"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Verify the proxy answers CORS preflight (expect 204 + ACAO):"
echo "  curl -i -X OPTIONS \"$PROXY_URL/v1/magic/order/shopify\" \\"
echo "    -H \"Origin: https://www.optimist.in\" -H \"Access-Control-Request-Method: POST\""

# AWS Documentation

## Steps to replicate

# Deploy script permissions

aws cloudformation update-stack \
 --stack-name viz-permissions \
 --template-body file://github-actions-access-policy.yml \
 --capabilities CAPABILITY_NAMED_IAM \
 --parameters file://github-actions-access-policy.params.json

## Package deployment

# AWS Documentation

## Steps to replicate

1. Set up PR workflow

aws cloudformation update-stack \
 --stack-name viz-library-pr \
 --template-body file://pr-build-cf.yml \
 --capabilities CAPABILITY_NAMED_IAM \
 --parameters file://pr-build-cf.json

2. Set up S3 buckets with cloudfront distribution for demo app, documentation

aws cloudformation create-stack \
 --stack-name vizcolib-demo-app-bucket-dist \
 --template-body file://cloudfront-bucket.yml \
 --parameters file://cloudfront-bucket-demo-app.json

aws cloudformation create-stack \
 --stack-name vizcolib-documentation-bucket-dist \
 --template-body file://cloudfront-bucket.yml \
 --parameters file://cloudfront-bucket-documentation.json

3. Set up library:

Create npm-store repo for the domain (if not already created)

aws cloudformation create-stack \
 --stack-name vizcolib-npm-store-repo \
 --template-body file://codeartifact-domain-store.yml \
 --parameters file://codeartifact-domain-store.json

Create library repo

aws cloudformation create-stack \
 --stack-name vizcolib-repo \
 --template-body file://codeartifact-repository.yml \
 --parameters file://codeartifact-repository.json

4. Set up CI/CD pipeline

aws cloudformation create-stack \
 --stack-name vizcolib-demo-app-build-pipeline \
 --template-body file://app-pipeline-cf.yml \
 --capabilities CAPABILITY_NAMED_IAM \
 --parameters file://app-pipeline-cf.params.json

## Some personal notes

In `viz-components/package.json`, include a prepare script that connects to codeartifact. This _should_ automatically run every time npm publish is called, but will not necessarily (gotta figure out how to fix this...) -- so prior to running npm publish, do run `npm run prepare`.

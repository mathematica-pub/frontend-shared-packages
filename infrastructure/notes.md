# AWS Documentation

## Steps to replicate

1. Set up PR workflow

aws cloudformation create-stack \
 --stack-name vizcolib-npm-source-repo \
 --template-body file://codeartifact-source-bucket.yml \
 --parameters file://codeartifact-source-bucket.json

2. Set up S3 buckets with cloudfront distribution for demo app, documentation

aws cloudformation create-stack \
 --stack-name vizcolib-npm-source-repo \
 --template-body file://codeartifact-source-bucket.yml \
 --parameters file://codeartifact-source-bucket.json

aws cloudformation create-stack \
 --stack-name vizcolib-npm-source-repo \
 --template-body file://codeartifact-source-bucket.yml \
 --parameters file://codeartifact-source-bucket.json

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
 --stack-name vizcolib-repo \
 --template-body file://codeartifact-repository.yml \
 --parameters file://codeartifact-repository.json

## Some personal notes

In `viz-components/package.json`, include a prepare script that connects to codeartifact. This _should_ automatically run every time npm publish is called, but will not necessarily (gotta figure out how to fix this...) -- so prior to running npm publish, do run `npm run prepare`.

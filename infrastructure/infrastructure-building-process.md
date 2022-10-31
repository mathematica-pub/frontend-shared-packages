# AWS Documentation

## Steps to replicate

1. Set up PR workflow

aws cloudformation update-stack \
 --stack-name viz-library-pr \
 --template-body file://pr-build-cf.yml \
 --capabilities CAPABILITY_NAMED_IAM \
 --parameters file://pr-build-cf.json

2. Set up package CI/CD pipeline

aws cloudformation update-stack \
 --stack-name vizcolib-package-pipeline \
 --template-body file://package-pipeline-cf.yml \
 --capabilities CAPABILITY_NAMED_IAM \
 --parameters file://package-pipeline-cf.params.json

## Package deployment

1. In `viz-components/package.json`, include a prepare script that connects to codeartifact. This _should_ automatically run every time npm publish is called, but will not necessarily -- prior to running npm publish, run `npm run prepare`.

2. `npm publish`

3. Log out of private npm repo (edit `.npmrc` file)

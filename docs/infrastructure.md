# AWS Documentation

## Steps to replicate

# Deploy script permissions

aws cloudformation update-stack \
 --stack-name viz-components-permissions \
 --template-body file://github-actions-access-policy.yml \
 --capabilities CAPABILITY_NAMED_IAM \
 --parameters file://github-actions-access-policy.params.json

## Package deployment

1. In `viz/package.json`, include a prepare script that connects to codeartifact. This _should_
   automatically run every time npm publish is called, but will not necessarily -- prior to running
   npm publish, run `npm run prepare`.

2. `npm publish`

3. Log out of private npm repo (edit `.npmrc` file)

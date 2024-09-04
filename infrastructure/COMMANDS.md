1. Creating ACM cert for shared packages

```
aws cloudformation create-stack --stack-name acm-cert-shared-packages --template-body file://acm-cert.yaml --capabilities CAPABILITY_NAMED_IAM --enable-termination-protection
```

2. Validating Certificate

```
aws cloudformation create-stack \
--stack-name acm-domain-validation-shared-package \
--template-body file://acm-domain-validation.yaml \
--parameters file://acm-domain-validation.params.json \
--capabilities CAPABILITY_NAMED_IAM \
--enable-termination-protection
```

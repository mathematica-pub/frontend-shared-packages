1. Creating ACM certificates

```
cd certificates

// For shared-packages.mathematica-dev.net

aws cloudformation create-stack \
--stack-name acm-cert-shared-packages \
--template-body file://acm-cert.yaml \
--parameters file://shared-packages-acm-cert.params.json \
--capabilities CAPABILITY_NAMED_IAM \
--enable-termination-protection

// For frontend.shared-packages.mathematica-dev.net

aws cloudformation create-stack \
--stack-name frontend-cert-shared-packages \
--template-body file://acm-cert.yaml \
--parameters file://frontend-shared-packages-acm-cert.params.json \
--capabilities CAPABILITY_NAMED_IAM \
--enable-termination-protection
```

2. Validating Certificates

```
cd route53-records

// For shared-packages.mathematica-dev.net

aws cloudformation create-stack \
--stack-name acm-domain-validation-shared-package \
--template-body file://acm-domain-validation.yaml \
--parameters file://shared-packages-domain-validation.params.json \
--capabilities CAPABILITY_NAMED_IAM \
--enable-termination-protection

// For frontend.shared-packages.mathematica-dev.net

aws cloudformation create-stack \
--stack-name frontend-domain-validation-shared-package \
--template-body file://acm-domain-validation.yaml \
--parameters file://frontend-shared-packages-domain-validation.params.json \
--capabilities CAPABILITY_NAMED_IAM \
--enable-termination-protection
```

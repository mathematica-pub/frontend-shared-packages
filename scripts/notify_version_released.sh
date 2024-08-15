#!/usr/bin/env bash

set -e

version=$(node -p "require('./projects/$pkg/package.json').version")

curl -X POST -H "Content-type: application/json" --data "{\"text\": \"$pkg v$version (<$pr_url|$pr_title>) has been released.\"}" $SLACK_WEBHOOK_URL
#!/usr/bin/env bash

set -e
set -x

source ./scripts/set_env_vars.sh

SLACK_WEBHOOK_URL=$SLACK_WEBHOOK_URL_VIC
curl -X POST -H "Content-type: application/json" --data "{\"text\": \"$pkg v$new_version (<$pr_url|$pr_title>) was approved and will be released on $next_weekday. Take a look if you'd like!\"}" $SLACK_WEBHOOK_URL
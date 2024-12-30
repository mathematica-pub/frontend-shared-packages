#!/usr/bin/env bash

set -e
set -x

for pkg in "${changed_pkgs[@]}"; do
    output=$(npx nx version $pkg --base=origin/main~1 --head=origin/main --dryRun --verbose 2>&1)
    new_version=$(echo "$output" | grep -oP 'Calculated new version "\K[0-9]+\.[0-9]+\.[0-9]+(?=")')
    echo "New version of $pkg: $new_version"
    SLACK_WEBHOOK_URL=$(./get_slack_webhook_url.sh $pkg)
    curl -X POST -H "Content-type: application/json" --data "{\"text\": \"$pkg v$new_version (<$pr_url|$pr_title>) was approved and will be released on $next_weekday. Take a look if you'd like!\"}" $SLACK_WEBHOOK_URL
done
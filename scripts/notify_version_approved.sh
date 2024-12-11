#!/usr/bin/env bash

set -e

pkgs=("viz-components" "ui-components" "app-dev-kit")
for pkg in "${pkgs[@]}"; do
    output=$(npx nx version $pkg --base=origin/main~1 --head=origin/main --dryRun --verbose 2>&1)
    if echo "$output" | grep -q "Nothing changed since last release."; then
        echo "No changes detected for $pkg since the last release."
    else
        new_version=$(echo "$output" | grep -oP 'Calculated new version "\K[0-9]+\.[0-9]+\.[0-9]+(?=")')
        echo "New version of $pkg: $new_version"
        if [ "$pkg" == "viz-components" ]; then
            SLACK_WEBHOOK_URL=$SLACK_WEBHOOK_URL_VIC
        elif [ "$pkg" == "ui-components" ]; then
            SLACK_WEBHOOK_URL=$SLACK_WEBHOOK_URL_UIC
        elif [ "$pkg" == "app-dev-kit" ]; then
            SLACK_WEBHOOK_URL=$SLACK_WEBHOOK_URL_ADK
        fi
        curl -X POST -H "Content-type: application/json" --data "{\"text\": \"$pkg v$new_version (<$pr_url|$pr_title>) was approved and will be released on $next_weekday. Take a look if you'd like!\"}" $SLACK_WEBHOOK_URL
    fi
done
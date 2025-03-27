#!/usr/bin/env bash

set -e
set -x

# Check if changed_pkgs is empty
if [ -z "${changed_pkgs}" ]; then
    SLACK_WEBHOOK_URL=$SLACK_WEBHOOK_URL_MAINTAINERS
    curl -X POST -H "Content-type: application/json" --data "{\"text\": \"PR (<$pr_url|$pr_title>) was approved and will be merged on $next_weekday. It is not expected to bump any package versions.\"}" $SLACK_WEBHOOK_URL
    echo "No packages with version bumps."
    exit 0
fi

# Convert the space-separated string to an array
IFS=' ' read -r -a changed_pkgs_array <<< "$changed_pkgs"

for pkg in "${changed_pkgs_array[@]}"; do
    output=$(npx nx version $pkg --base=origin/main~1 --head=origin/main --skipPrerelease --dryRun --verbose 2>&1)
    new_version=$(echo "$output" | grep -oP 'Calculated new version "\K[0-9]+\.[0-9]+\.[0-9]+(?=")')
    echo "New version of $pkg: $new_version"
    SLACK_WEBHOOK_URL=$(source ./scripts/get_slack_webhook_url.sh $pkg)
    curl -X POST -H "Content-type: application/json" --data "{\"text\": \"$pkg v$new_version (<$pr_url|$pr_title>) was approved and will be released on $next_weekday. Take a look if you'd like!\"}" $SLACK_WEBHOOK_URL
done
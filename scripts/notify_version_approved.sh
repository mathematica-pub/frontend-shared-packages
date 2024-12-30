#!/usr/bin/env bash

set -e
set -x

chmod +x ./scripts/get_slack_webhook_url.sh

# Source the environment variables
source ./scripts/set_env_vars.sh

# Check if changed_pkgs is empty
if [ -z "${changed_pkgs}" ]; then
    echo "No packages with version bumps."
    exit 0
fi

# Convert the space-separated string to an array
IFS=' ' read -r -a changed_pkgs_array <<< "$changed_pkgs"

for pkg in "${changed_pkgs_array[@]}"; do
    output=$(npx nx version $pkg --base=origin/main~1 --head=origin/main --dryRun --verbose 2>&1)
    new_version=$(echo "$output" | grep -oP 'Calculated new version "\K[0-9]+\.[0-9]+\.[0-9]+(?=")')
    echo "New version of $pkg: $new_version"
    SLACK_WEBHOOK_URL=$(./scripts/get_slack_webhook_url.sh $pkg)
    curl -X POST -H "Content-type: application/json" --data "{\"text\": \"$pkg v$new_version (<$pr_url|$pr_title>) was approved and will be released on $next_weekday. Take a look if you'd like!\"}" $SLACK_WEBHOOK_URL
done
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
    version=$(git tag --list "$pkg-*" | sort -V | tail -n 1 | sed "s/$pkg-//")
    echo "New version of $pkg: $version"
    SLACK_WEBHOOK_URL=$(./scripts/get_slack_webhook_url.sh $pkg)
    curl -X POST -H "Content-type: application/json" --data "{\"text\": \"$pkg v$version (<$pr_url|$pr_title>) has been released.\"}" $SLACK_WEBHOOK_URL
done
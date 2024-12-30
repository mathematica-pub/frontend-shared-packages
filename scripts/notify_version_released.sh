#!/usr/bin/env bash

set -e
set -x

for pkg in "${$changed_pkgs[@]}"; do
    version=$(git tag --list "$pkg-*" | sort -V | tail -n 1 | sed "s/$pkg-//")
    echo "New version of $pkg: $version"
    SLACK_WEBHOOK_URL=$(./get_slack_webhook_url.sh $pkg)
    curl -X POST -H "Content-type: application/json" --data "{\"text\": \"$pkg v$version (<$pr_url|$pr_title>) has been released.\"}" $SLACK_WEBHOOK_URL
done


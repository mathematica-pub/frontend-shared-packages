#!/usr/bin/env bash

set -e
set -x

SAFE_PACKAGE_NAME=$(echo "$REFERENCED_PACKAGE" | tr '-' '_')

# Try to get the current version from a GitHub variable
CURRENT_VERSION=$(gh api \
    -H "Accept: application/vnd.github+json" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    /repos/${GITHUB_REPOSITORY}/actions/variables/TEST_VERSION_${SAFE_PACKAGE_NAME} \
    --jq '.value' 2>/dev/null || echo "0")

NEW_VERSION=$((CURRENT_VERSION + 1))

echo "beta_version=${NEW_VERSION}" >> $GITHUB_ENV
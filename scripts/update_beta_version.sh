#!/usr/bin/env bash

set -e
set -x


SAFE_PACKAGE_NAME=$(echo "$REFERENCED_PACKAGE" | tr '-' '_')

VAR_NAME="TEST_VERSION_${SAFE_PACKAGE_NAME}"

# Check if variable exists
if gh api \
        -H "Accept: application/vnd.github+json" \
        -H "X-GitHub-Api-Version: 2022-11-28" \
        /repos/${GITHUB_REPOSITORY}/actions/variables/$VAR_NAME \
        >/dev/null 2>&1; then

# Update existing variable
    gh api \
        --method PATCH \
        -H "Accept: application/vnd.github+json" \
        -H "X-GitHub-Api-Version: 2022-11-28" \
        /repos/${{ github.repository }}/actions/variables/$VAR_NAME \
        -f name="$VAR_NAME" \
        -f value="$beta_version"

    echo "✅ Updated $VAR_NAME to $beta_version"
else
    # Create new variable
    gh api \
        --method POST \
        -H "Accept: application/vnd.github+json" \
        -H "X-GitHub-Api-Version: 2022-11-28" \
        /repos/${{ github.repository }}/actions/variables \
        -f name="$VAR_NAME" \
        -f value="$beta_version"

    echo "✅ Created $VAR_NAME with value $beta_version"
fi
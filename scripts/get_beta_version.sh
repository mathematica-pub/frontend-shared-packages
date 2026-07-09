#!/usr/bin/env bash

set -e
set -x

echo "📦 Getting beta versions for package: $REFERENCED_PACKAGE"

# Get all versions from npm registry
ALL_VERSIONS=$(npm view "@mathstack/$REFERENCED_PACKAGE" versions --json 2>/dev/null)

if [ $? -ne 0 ] || [ "$ALL_VERSIONS" = "null" ] || [ -z "$ALL_VERSIONS" ]; then
    echo "⚠️ Package not found in npm registry or no versions published"
    echo "🆕 Starting with beta version: 0.0.1-beta.0"
    NEW_BETA_VERSION="0.0.1-beta.0"
else
    # Filter for beta versions with the pattern 0.0.1-beta.X
    # Handle both flat arrays and nested arrays from npm view
    BETA_VERSIONS=$(echo "$ALL_VERSIONS" | jq -r 'flatten | .[] | select(test("^0\\.0\\.1-beta\\.[0-9]+$"))' 2>/dev/null)
    
    if [ -z "$BETA_VERSIONS" ]; then
        echo "⚠️ No beta versions found with pattern 0.0.1-beta.X"
        echo "🆕 Starting with beta version: 0.0.1-beta.0"
        NEW_BETA_VERSION="0.0.1-beta.0"
    else
        # Get the highest beta number
        HIGHEST_BETA=$(echo "$BETA_VERSIONS" | sed 's/0\.0\.1-beta\.//' | sort -n | tail -n1)
        
        echo "📊 Latest beta version found: 0.0.1-beta.$HIGHEST_BETA"
        
        # Increment the beta number
        NEW_BETA_NUMBER=$((HIGHEST_BETA + 1))
        NEW_BETA_VERSION="0.0.1-beta.$NEW_BETA_NUMBER"
    fi
fi

echo "🚀 Next beta version: $NEW_BETA_VERSION"

echo "beta_version=${NEW_BETA_VERSION}" >> $GITHUB_ENV
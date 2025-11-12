#!/usr/bin/env bash

set -e
set -x

pkgs=("viz" "ui" "app-kit")
changed_pkgs=()
for pkg in "${pkgs[@]}"; do
    output=$(npx nx version $pkg --dryRun --verbose 2>&1)
    if ! echo "$output" | grep -q "Nothing changed since last release."; then
        changed_pkgs+=("$pkg")
    fi
done

echo "changed_pkgs=${changed_pkgs[@]}" >> $GITHUB_ENV
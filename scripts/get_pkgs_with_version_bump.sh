#!/usr/bin/env bash

set -e
set -x

pkgs=("viz-components" "ui-components" "app-dev-kit")
changed_pkgs=()
for pkg in "${pkgs[@]}"; do
    output=$(npx nx version $pkg --base=origin/main~1 --head=origin/main --dryRun --verbose 2>&1)
    if ! echo "$output" | grep -q "Nothing changed since last release."; then
        changed_pkgs+=("$pkg")
    fi
done

if [ ${#changed_pkgs[@]} -eq 0 ]; then
    echo "changed_pkgs=[]" >> $GITHUB_ENV
else
    echo "changed_pkgs=${changed_pkgs[@]}" >> $GITHUB_ENV
fi
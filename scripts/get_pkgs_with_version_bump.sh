#!/usr/bin/env bash

set -e
set -x

pkgs=("viz-components" "ui-components" "app-dev-kit")
changed_pkgs=()
for pkg in "${pkgs[@]}"; do
    output=$(npx nx version $pkg --base=origin/main~1 --head=origin/main --tagPrefix=v --dryRun --verbose 2>&1)
    if ! echo "$output" | grep -q "Nothing changed since last release."; then
        changed_pkgs+=("$pkg")
    fi
done

echo "changed_pkgs=${changed_pkgs[@]}" >> $GITHUB_ENV
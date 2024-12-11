#!/usr/bin/env bash

set -e

pkgs=("viz-components" "ui-components")
for pkg in "${pkgs[@]}"; do
output=$(aws codeartifact list-package-versions --package $pkg \
    --domain shared-package-domain \
    --domain-owner 922539530544 \
    --namespace hsi \
    --repository shared-package-repository \
    --format npm \
    --output json)

latest_version=$(echo "$output" | jq -r '.versions[] | select(.version | test("^[0-9]+\\.[0-9]+\\.[0-9]+$")) | .version' | sort -V | tail -n 1)
current_version=$(node -p "require('./libs/$pkg/package.json').version")

echo "Latest version of $pkg: $latest_version"
echo "Current version of $pkg: $current_version"

curr_version_arr=(${current_version//./ })
latest_version_arr=(${latest_version//./ })

for i in {0..2}; do
    if [ "${curr_version_arr[$i]}" -gt "${latest_version_arr[$i]}" ]; then
        if [ "$pkg" == "viz-components" ]; then
            SLACK_WEBHOOK_URL=$SLACK_WEBHOOK_URL_VIC
        else
            SLACK_WEBHOOK_URL=$SLACK_WEBHOOK_URL_UIC
        fi
        curl -X POST -H "Content-type: application/json" --data "{\"text\": \"$pkg v$current_version (<$pr_url|$pr_title>) was approved and will be released on $next_weekday. Take a look if you'd like!\"}" $SLACK_WEBHOOK_URL
        break
    elif [ "${curr_version_arr[$i]}" -lt "${latest_version_arr[$i]}" ]; then
        echo "Current version of $pkg is less than latest version"
        break
    fi
done

if [ "$latest_version" == "$current_version" ]; then
    echo "$pkg version has not been updated"
fi
done
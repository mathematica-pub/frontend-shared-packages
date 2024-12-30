#!/usr/bin/env bash

set -e
set -x

if [ "$pkg" == "viz-components" ]; then
    WEBHOOK_URL=$SLACK_WEBHOOK_URL_VIC
elif [ "$pkg" == "ui-components" ]; then
    WEBHOOK_URL=$SLACK_WEBHOOK_URL_UIC
elif [ "$pkg" == "app-dev-kit" ]; then
    WEBHOOK_URL=$SLACK_WEBHOOK_URL_ADK
fi
echo $WEBHOOK_URL
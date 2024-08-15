#!/usr/bin/env bash
rm -rf documentation
npm run compodoc:build:ui-components
pipenv run python projects/demo-app/documentation-generator/documentation-parser.py --ui-components
npm run compodoc:build:viz-components
pipenv run python projects/demo-app/documentation-generator/documentation-parser.py --viz-components
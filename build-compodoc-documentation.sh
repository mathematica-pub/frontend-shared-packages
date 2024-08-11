#!/usr/bin/env bash
rm -rf documentation
npm run compodoc:build -p projects/viz-components/tsconfig.doc.json -d documentation/viz-components
pipenv run python projects/demo-app/documentation-generator/documentation-parser.py --viz-components
npm run compodoc:build -p projects/ui-components/tsconfig.doc.json -d documentation/ui-components
pipenv run python projects/demo-app/documentation-generator/documentation-parser.py --ui-components
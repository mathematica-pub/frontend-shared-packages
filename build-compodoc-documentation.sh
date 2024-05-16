#!/usr/bin/env bash
rm -rf documentation
npm run compodoc:build
pipenv run python projects/demo-app/documentation-generator/documentation-parser.py
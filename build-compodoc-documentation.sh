#!/usr/bin/env bash
npm run compodoc:build
pipenv run python projects/demo-app/documentation-generator/documentation-parser.py
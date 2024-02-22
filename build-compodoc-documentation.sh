#!/usr/bin/env bash
npm run compodoc:build
ls projects/demo-app/src/assets/documentation
pipenv run python projects/demo-app/documentation-generator/documentation-parser.py
#!/usr/bin/env bash
npm run compodoc:build
ls 
pipenv run python projects/demo-app/documentation-generator/documentation-parser.py
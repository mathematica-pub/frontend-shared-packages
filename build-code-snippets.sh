#!/usr/bin/env bash
pipenv run python projects/viz-components/code-snippets/code_snippet_generator.py
cp .vscode/vizcolib-configs.code-snippets dist/viz-components
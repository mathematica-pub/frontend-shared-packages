#!/bin/bash
echo 'update package version'
npm version patch --prefix projects/viz-components

echo 'generate code snippets'
cd projects/viz-components/code-snippets
python code_snippet_generator.py 
cd ../../..

echo 'building vizcolib'
npm install 
./build.sh 
cp .vscode/vizcolib-configs.code-snippets dist/viz-components

echo 'logging in to aws'
npm run prepare --prefix projects/viz-components

echo 'publishing package'
cd dist/viz-components
npm publish
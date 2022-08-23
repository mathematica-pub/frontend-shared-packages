#!/bin/bash
echo 'update package version'
# npm version patch 
# npm version patch --prefix projects/viz-components

echo 'building vizcolib'
npm install 
./build.sh 

echo 'logging in to aws'
npm run prepare --prefix projects/viz-components

echo 'publishing package'
cd dist
npm publish @web-ast/viz-components --dry-run
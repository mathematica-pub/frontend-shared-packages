#!/bin/bash
echo 'building vizcolib'
npm install 
./build.sh 

echo 'update package version'
npm version patch 

echo 'logging in to aws'
npm run prepare --prefix projects/viz-components

echo 'publishing package'
cd dist
npm publish @web-ast/viz-components --dry-run
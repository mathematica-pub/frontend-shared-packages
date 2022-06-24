#!/bin/bash
echo 'building viz-library components'
npm run build viz-components
echo 'building viz-library schematics'
npm run build --prefix projects/viz-components
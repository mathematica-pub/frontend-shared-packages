#!/bin/bash
mkdir -p ../../dist/viz-components/raw-html 

cp src/lib/bars/bars.component.html \
    src/lib/chart/chart.component.html \
    src/lib/html-tooltip/html-tooltip.html \
    src/lib/lines/lines.html \
    src/lib/map/map.component.html \
    src/lib/x-axis/x-axis.component.html \
    src/lib/xy-chart-background/xy-chart-background.component.html \
    src/lib/xy-chart-space/xy-chart-space.html \
    src/lib/y-axis/y-axis.html \
    ../../dist/viz-components/raw-html

cp schematics/collection.json \
    ../../dist/viz-components
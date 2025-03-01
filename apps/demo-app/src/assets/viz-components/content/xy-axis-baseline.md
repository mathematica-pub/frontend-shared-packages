# XY Axis Baseline

## Overview

Users can use the `baseline` method on an x- or y-axis builder to specify properties for the
baseline of that axis. The baseline is a line that runs the length of a chart dimension axis, from
which tick marks and labels are drawn.

By default, baselines are drawn on quantitative axes and omitted on ordinal axes. If there are
positive and negative values on a chart, the baseline for the perpendicuar axis will be default be
repositioned to the zero tick mark.

```custom-angular
small axis baseline examples
```

## Configuration

### Required Methods

There are no required methods.

### Optional Methods

```builder-method
name: display
description: Determines whether the baseline will be displayed.
params:
  - name: display
    type: boolean
    description:
      - '`true` to display the baseline, `false` to hide the baseline.'
      - 'If not called, the default value is `true` on quantitative axes and `false` on ordinal axes.'
```

```builder-method
name: zeroBaseline
description: Creates specifications for the baseline that is drawn at the zero tick mark of the perpendicular axis when there are positive and negative values in the chart.
params:
  - name: zeroBaseline
    type: 'Partial<{ dasharray: string | display: boolean }> | null'
    description:
      - 'An object with up to two properties: `dasharray` and `display`. `dasharray` is a string that specifies the stroke-dasharray of the zero baseline, and `display` is a boolean that determines whether the zero baseline will be appear on the chart.'
      - 'If `dasharray` is `none`, the zero baseline will be drawn as a solid line.'
      - 'If `display` is `false`, the zero baseline will never be drawn. If `display` is `true`, the zero baseline will be drawn if the chart has both positive and negative values, even if the `display` on the chart-edge baseline is `false`.'
      - "If not called or if called with `null`, the default value is `{ dasharray: '2 2', display: true }`."
```

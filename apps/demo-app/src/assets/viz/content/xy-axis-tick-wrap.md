# XY Axis Tick Wrap

## Overview

Users can use the `tickWrap` method on an x- or y-axis builder to specify how tick labels will be
wrapped if they are too long to fit in the available space. This is useful for ensuring that tick
labels are readable and do not overlap with other elements on the chart.

```custom-angular
small axis tick wrap examples
```

## Configuration

**Examples of configuration for `wrap`**

```ts
// Wrapped y-axis tick labels
const ordinalAxis = this.yOrdinalAxis
  .ticks((ticks) => wrap((wrap) => wrap.width(120)))
  .getConfig();

// Wrapped x-axis tick labels
const ordinalAxis = this,xOrdinalAxis
  .ticks((ticks) => wrap((wrap) => wrap.width(100)))
  .getConfig();
```

### Required Methods

There are no required methods.

### Optional Methods

```builder-method
name: lineHeight
description: 'Sets the line-height property of the tick labels. Adjusting the line-height can useful when wrapping labels, particularly on a y-axis.'
params:
  - name: lineHeight
    type: 'number | null'
    description:
      - The line height of the tick labels in pixels.
      - "If not called, the default value is `null`, and the existing line-height will be used."
```

```builder-method
name: maintainXPosition
description: 'Determines whether the x-position of the tick labels should be maintained when wrapping. Defaults to `true` for y-axis labels and `false` for x-axis labels.'
params:
  - name: maintainXPosition
    type: 'boolean | null'
    description:
      - '`true` to maintain the x-position of the tick labels, `false` to allow the x-position to change.'
      - 'The default is configured so that this should only be called in unusual cases.'
```

```builder-method
name: maintainYPosition
description: 'Determines whether the y-position of the tick labels should be maintained when wrapping. Defaults to `true` for y-axis labels and `false` for x-axis labels.'
params:
  - name: maintainYPosition
    type: 'boolean | null'
    description:
      - '`true` to maintain the y-position of the tick labels, `false` to allow the y-position to change.'
      - 'The default is configured so that this should only be called in unusual cases.'
```

```builder-method
name: width
description: Sets the maximum width of the tick labels after wrapping.
params:
  - name: width
    type: 'number | null'
    description:
      - The maximum width of the tick labels in pixels.
      - "If not called, the default value is `null`, meaning no wrapping will occur."
```

# XY Axis Grid

## Overview

Users can use the `grid` method to draw grid lines oriented perpendicular to a particular axis.

By default, one grid line is drawn for each axis tick. However, axis grids can be customized by
using the `filter` and `stroke` methods. These methods allow the user to conditionally hide grid
lines or style them, respectively.

```custom-angular
small axis grid examples
```

```ts
// grid with default settings
this.xQuantitativeAxis.grid().getConfig();
this.yQuantitativeAxis.grid().getConfig();

// grid with custom filtering and styling
this.xQuantitativeAxis
  .grid((grid) =>
    grid.filter((i) => i % 2 !== 0).stroke((stroke) => stroke.dasharray('5').color('blue'))
  )
  .getConfig();
this.yQuantitativeAxis
  .grid((grid) =>
    grid.filter((i) => i % 2 !== 0).stroke((stroke) => stroke.dasharray('5').color('red'))
  )
  .getConfig();
```

## Configuration

### Required Methods

There are no required methods for axis grids.

### Optional Methods

```builder-method
name: filter
description: Determines whether or not to display grid lines. Must specify a function that takes the index of the grid line and returns a boolean. By default, this function filters out the first grid line (that overlaps the axis domain line). This can be overridden by specifying a filter function of `(i) => true`.
params:
  - name: filter
    type: '((i: number) => boolean) | null'
    description: A predicate that determines for which indices grid lines should be displayed.
```

```builder-method
name: stroke
description: Sets the stroke attributes for each grid line.
params:
  - name: stroke
    type: '((stroke: StrokeBuilder) => void) | null'
    description: A callback that allows for the specification of the attributes for the stroke of the dots.
```

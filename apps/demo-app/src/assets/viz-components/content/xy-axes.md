# XY Axes

## Overview

Viz Components provides a number of axis components that allow you add visual axes, ticks, and axis
labels to charts that have x and y dimensions. The axes work with dimensions whose data is either
ordinal or continuous-quantitative (`number` or `Date`).

```custom-angular
small axis examples
```

## Configuration

There are four builders for the axes components, one for each permutation of chart dimensions (x or
y) and data type for the dimension (ordinal and quantitative):

- `VicXOrdinalAxisConfigBuilder`
- `VicXQuantitativeAxisConfigBuilder`
- `VicYOrdinalAxisConfigBuilder`
- `VicYQuantitativeAxisConfigBuilder`

Each builder requires one generic type, which should be the type of the tick value, for example,
`string`, `number`, or `Date`.

**Required imports from @hsi/viz-components**

```ts
import { VicXQuantitativeAxisConfigBuilder } from '@hsi/viz-components';
...
@Component({
  ...
  imports: [
    VicChartModule,
    VicXyChartModule,
    VicXQuantitativeAxisModule
    ...
  ],
  ...
  providers: [
    VicXQuantitativeAxisConfigBuilder
    ...
  ]
})
constructor(private xAxis: VicXQuantitativeConfigBuilder<number>) {}
```

### Required Methods

There are no required methods for any of the axis builders.

### Optional Methods

```builder-method
name: baseline
description: Specifies the configuration for the axis baseline. The baseline is the line that typically runs along the edge of the chart, from which tick marks and labels are drawn.
params:
  - name: baseline
    type: '((baseline: BaselineBuilder) => void) | null'
    description:
      - 'A function that specifies properties for the baseline, or `null` to unset the baseline.'
      - 'If called with no argument, the default values of the baseline will be used.'
```

```builder-method
name: 'class'
description: 'Sets a class that is applied to the top-level `SVGGElement` of the axis.'
params:
  - name: value
    type: string | null
    description:
      - 'A string value for the `class` attribute of the `SVGGElement`.'
      - 'If not called or called with null, no class will be applied.'
```

```builder-method
name: grid
description: Specifies the configuration of grid lines for the axis. Grid lines are the lines that run perpendicular to the axis and intersect with tick marks.
params:
  - name: grid
    type: '((grid: GridBuilder) => void) | null'
    description:
      - A callback that specifies properties for the grid lines, or `null` to unset the grid.
      - If called with no argument, the default values of the grid will be used.
```

```builder-method
name: label
description: Specifies properties for an axis label.
params:
  - name: label
    type: '((label: AxisLabelBuilder) => void) | null'
    description: A callback that specifies properties for an axis label, or `null` to unset the label.
```

```builder-method
name: mixBlendMode
description: Sets the mix-blend-mode for the svg. If not called, the default mix-blend-mode is `normal`.
params:
  - name: mixBlendMode
    type: string | null
    description: A string value for the `mix-blend-mode` attribute of the `SVGElement`.
```

```builder-method
name: side
description: Specifies the location of the axis on the chart. Valid values are specific to the axis type.
params:
  - name: value
    type: "'top' | 'bottom' or 'left' | 'right'"
    description:
      - 'The side of the chart where the axis will be placed.'
      - 'If the axis is an X axis, the valid values are `top` and `bottom`, and the default value is `bottom`.'
      - 'If the axis is a Y axis, the valid values are `left` and `right`, and the default value is `left`.'
      - 'If not called, the default value is used.'
```

```builder-method
name: ticks
description: Specifies the configuration for the axis ticks.
params:
  - name: ticks
    type: '((ticks: TicksBuilder) => void) | null'
    description:
      - 'A function that specifies properties for the ticks, or `null` to unset the ticks.'
      - 'If not called or called with `null`, the default values of the ticks will be used.'
```

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

```ts
import { VicDotsConfigBuilder } from '@hsi/viz-components';
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

Some methods are common to all four builders, while others are specific to the builder's chart
dimension or data type.

### Required Methods

There are no required methods for any of the axis builders.

### Optional Methods

#### Common (all axis builders)

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
name: removeDomainLine
description:  Determines whether the axis domain line will be removed.
params:
  - name: removeDomainLine
    type: "'always' | 'never' | 'unlessZeroAxis'"
    description:
      - '`always` will remove domain line that D3 creates in all cases.'
      - '`never` will retain the line in all cases.'
      - '`unlessZeroAxis` will remove the line if the line is positioned at the edge of the chart, but will retain the line if the chart has both positive and negative values, causing the line to be positioned in the middle of the chart.'
      - 'If called with no argument, the default value is `unlessZeroAxis`.'
      - 'If not called, the default value for ordinal axes is `unlessZeroAxis` and for quantitative axes is `never`.'
```

```builder-method
name: removeTickLabels
description: Determines whether tick labels (`SVGTextElement`s) will be removed from the axis.
params:
  - name: removeTickLabels
    type: boolean
    description:
      - '`true` to remove all tick labels, `false` to retain all tick labels.'
      - 'If called with no argument, the default value is `true`.'
      - 'If not called, the default value is `false`.'
```

```builder-method
name: removeTickMarks
description: Determines whether tick marks (`SVGLineElement`s) will be removed from the axis.
params:
  - name: value
    type: boolean
    description:
      - '`true` to remove all tick marks, `false` to retain all tick marks.'
      - 'If called with no argument, the default value is `true`.'
      - 'If not called, the default value is `false`.'
```

```builder-method
name: tickFormat
description: Specifies how tick labels will be formatted. The format can be a string or a function.
params:
  - name: tickFormat
    type: 'string | ((value: TickValue) => string) | null'
    description:
      - 'Either a D3 format string, a function that takes a value and returns a string, or `null` to unset the format.'
      - "If not called, the default value for quantitative axes is ',.1f'. If not called for an ordinal axis, tick labels will be the unformatted ordinal value."
```

```builder-method
name: tickLabelFontSize
description: Specifies the font size of tick and axis labels.
params:
  - name: value
    type: number | null
    description:
      - 'The font size in px, or `null` to unset the font size.'
      - "If not called, D3's default font size will be used."
```

```builder-method
name: tickSizeOuter
description: Determines the length of the square ends of the domain path drawn by D3.
params:
  - name: size
    type: number | null
    description:
      - 'The length of the square ends of the domain path in pixels, or `null` to unset the value.'
      - "If not called on ordinal axes, the default value is 0. If not called on quantitative axes, no modification is made to D3's default value."

```

```builder-method
name: wrapTickText
description: Specifies how tick labels will be wrapped.
params:
  - name: wrap
    type: '((wrap: TickWrapBuilder) => void) | null'
    description:
      - 'A callback that specifies how tick labels will be wrapped, or `null` to unset the wrapping.'
      - 'If not called, the tick labels will not be wrapped.'
```

```builder-method
name: zeroAxis
description: Determines whether an axis is drawn at the zero tick mark of the perpedicular axis when there re positive and negative values in the chart, and the stroke-dasharray of the zero axis if drawn.
params:
  - name: zeroAxis
    type: '{ strokeDasharray: string | null, useZeroAxis: boolean } | null'
    description:
      - An object with two properties: `strokeDasharray` and `useZeroAxis`. `strokeDasharray` is a string that specifies the stroke-dasharray of the zero axis, and `useZeroAxis` is a boolean that determines whether the zero axis will be drawn.
      - If `strokeDasharray` is `null`, the zero axis will be drawn as a solid line.
      - If `useZeroAxis` is `false`, the zero axis will not be drawn, and the domain line will be drawn at the edge of the chart.
      - If not called, or if called with `null`, the default value is `{ strokeDasharray: '2 2', useZeroAxis: true }`.
```

#### X Axes

```builder-method
name: side
description: Specifies the location of the axis on the chart.
params:
  - name: value
    type: "'top' | 'bottom'"
    description:
      - 'The side of the chart where the axis will be placed.'
      - 'If not called, the default value is `bottom`.'
```

#### Y Axes

```builder-method
name: side
description: Specifies the location of the axis on the chart.
params:
  - name: value
    type: "'left' | 'right'"
    description:
      - 'The side of the chart where the axis will be placed.'
      - 'If not called, the default value is `left`.'
```

#### Ordinal Axes

There are no methods that are exclusive to ordinal axes.

#### Quantitative Axes

```builder-method
name: numTicks
description: Approximately specifies the number of ticks for the axis.
params:
  - name: value
    type: number | null
    description:
      - "The number of ticks to pass to D3's axis.ticks(), or null to unset the number of ticks."
      - If not called, a reasonable and valid default will be used based on the size of the chart.
      - "Note that this number will be passed to D3's `ticks()` method and therefore it can be an approximate number of ticks."
```

```builder-method
name: tickValues
description: Determines the values that will show up as ticks on the axis.
params:
  - name: values
    type: TickValue[] | null
    description: "An array of quantitative values to pass to D3's axis.tickValues(), or null to unset the tick values."
```

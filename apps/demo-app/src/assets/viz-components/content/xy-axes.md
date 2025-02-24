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
description: Sets the grid for the axis.
params:
  - name: grid
    type: '((grid: GridBuilder) => void) | null'
    description: A callback that allows for the specification of an axis grid.
```

```builder-method
name: label
description: Sets the label for the axis.
params:
  - name: label
    type: '((label: AxisLabelBuilder) => void) | null'
    description: A callback that allows for the specification of an axis label.
```

```builder-method
name: mixBlendMode
description: Sets the mix-blend-mode for the svg. If not called, the default mix-blend-mode is 'normal'.
params:
  - name: mixBlendMode
    type: string | null
    description: A string value for the `mix-blend-mode` attribute of the `SVGElement`.
```

```builder-method
name: removeDomainLine
description: Removes the D3 domain line from the axis.
params:
  - name: removeDomainLine
    type: boolean
    description: If called with `true`, the D3 domain line will be removed from the axis. Calling with no argument will have the same effect as calling with `true`.
```

```builder-method
name: removeTickLabels
description: Removes the D3 tick marks (`SVGTextElement`s) from the axis.
params:
  - name: removeTickLabels
    type: boolean
    description: If called with `true`, the D3 tick marks will be removed from the axis. Calling with no argument will have the same effect as calling with `true`.
```

```builder-method
name: removeTickMarks
description: Removes the D3 tick marks (`SVGLineElement`s) from the axis.
params:
  - name: removeTickMarks
    type: boolean
    description: If called with `true`, the D3 tick marks will be removed from the axis. Calling with no argument will have the same effect as calling with `true`.
```

```builder-method
name: tickFormat
description: Used to format the tick labels. If not provided on quantitative axes, ticks will be formatted with ',.1f'.
params:
  - name: tickFormat
    type: 'value: string | ((value: TickValue) => string) | null'
    description: A D3 format specifier, such as '.2f' or '.0%', or a function that takes a tick value and returns a string.
```

```builder-method
name: tickLabelFontSize
description: Sets the font size for the tick labels. If not specified, D3's default font size will be used.
params:
  - name: fontSize
    type: number | null
    description: The font size for the tick labels, in px.
```

```builder-method
name: tickSizeOuter
description: Sets the size of the outer tick marks. If not specified on ordinal axes, the value will be set to zero. D3's default outer tick size will be used if not provided on quantitative axes.
params:
  - name: size
    type: number | null
    description: The size of the outer tick marks, in px. If `null`, D3's default outer tick size will be used.
```

```builder-method
name: wrapTickText
description: Configures tick wrapping.
params:
  - name: wrap
    type: '((wrap: TickWrapBuilder) => void) | null'
    description: A function that specifies properties for wrapping the tick text.
```

#### X Axes

```builder-method
name: side
description: Sets the side of the chart where the axis will be placed. If not called, the default value is 'bottom'.
params:
  - name: side
    type: "'top' | 'bottom'"
```

#### Y Axes

```builder-method
name: side
description: Sets the side of the chart where the axis will be placed. If not called, the default value is 'left'.
params:
  - name: side
    type: "'left' | 'right'"
```

#### Ordinal Axes

There are no methods that are exclusive to ordinal axes.

#### Quantitative Axes

```builder-method
name: numTicks
description: Sets the number of ticks on the axis. If not specified, a reasonable and valid default will be used based on the size of the chart. Note that this number will be passed to D3's `ticks()` method and therefore it can be an approximate number of ticks.
params:
  - name: numTicks
    type: number
    description: The number of ticks to display on the axis.
```

```builder-method
name: tickValues
description: Sets specific tick values for the axis. If not specified, D3 will determine the tick values.
params:
  - name: tickValues
    type: TickValue[]
    description: An array of tick values to display on the axis. `TickValue` extends `number` | `string` | `Date`.
```

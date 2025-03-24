# XY Axis Ticks

## Overview

Users can use the `ticks` method on an x- or y-axis builder to specify properties for the ticks of
that axis. Ticks are the small lines that are drawn along the axis, and the associated labels.

If the `ticks` method is never called, the default settings will be applied.

## Configuration

**Examples of configuration for `ticks`**

```ts
// example: to specify that the x-axis should have ~10 ticks, tick labels formatted as floating point numbers with one decimal place, and not show any tick marks.
this.xQuantitativeAxis.ticks((ticks) => ticks.format('.1f').size(0).count(10)).getConfig();

// example: to specify the exact tick values to show on the y-axis.
this.yQuantitativeAxis.ticks((ticks) => ticks.values([0, 10, 20, 30]).getConfig();
```

### Required Methods

There are no required methods.

### Optional Methods

#### All axes

```builder-method
name: fontSize
description: Sets the font size of the tick labels.
params:
  - name: fontSize
    type: 'number | null'
    description:
      - The font size of the tick labels, in px.
      - "If not called, the default font size is D3's default, which is 10px."
```

```builder-method
name: format
description: Specifies how tick labels will be formatted.
params:
  - name: format
    type: 'string | ((value: Tick) => string) | null'
    description:
      - 'Either a D3 format string, a function that takes a value and returns a string, or `null` to unset the format.'
      - "If not called, the default value for quantitative axes is ',.1f'. If not called for an ordinal axis, tick labels will be the unformatted ordinal value."
```

```builder-method
name: labelsDisplay
description: Determines whether tick labels will be displayed.
params:
  - name: value
    type: 'boolean'
    description:
      - '`true` to retain all tick labels, `false` to remove all tick labels.'
      - 'If not called, the default value is `true`.'
```

```builder-method
name: labelsStroke
description: Sets the color of the stroke around the tick labels. this can be used to improve the legibility of tick labels, for example, when the tick labels are placed on a colored background.
params:
  - name: value
    type: 'string | null'
    description:
      - The stroke of the tick labels.
      - "If not called, the default value is `none`."
```

```builder-method
name: labelsStrokeOpacity
description: Sets the opacity of the stroke applied around the tick labels.
params:
  - name: value
    type: 'number | null'
    description:
      - The opacity of the stroke around the tick labels.
      - "If not called, the default value is 1."
```

```builder-method
name: labelsStrokeWidth
description: Sets the width of the stroke applied around the tick labels.
params:
  - name: value
    type: 'number | null'
    description:
      - The width of the stroke around the tick labels.
      - "If not called, the default value is 3."
```

```builder-method
name: rotate
description: Determines the rotation of tick labels. Often used on vertical bar charts or when the tick labels are long.
params:
  - name: value
    type: 'number | null'
    description:
      - The rotation of the tick labels in degrees, or `null` to unset the rotation.
      - Positive values rotate the labels counterclockwise, negative values rotate them clockwise.
      - If not called, the ticks will not be rotated.
```

```builder-method
name: size
description: 'Sets the size of the inner and outer tick marks. To show no tick marks, set the size to 0.'
params:
  - name: value
    type: 'number | null'
    description:
      - The size of the ticks, in px.
      - 'If not called or called with `null`, the default size is the D3 default size.'
      - 'If specified, this value will override any values set by `sizeInner` or `sizeOuter`.'
```

```builder-method
name: sizeInner
description: Determines the length of the inner tick marks.
params:
  - name: value
    type: 'number | null'
    description:
      - 'The length of the inner tick marks in pixels, or `null` to unset the value.'
      - 'If not called or called with `null`, the default size is the D3 default size.'
```

```builder-method
name: sizeOuter
description: Determines the length of the square ends of the domain path drawn by D3.
params:
  - name: value
    type: 'number | null'
    description:
      - The length of the square ends of the domain path in pixels, or `null` to unset the value.
      - 'If not called on ordinal axes, the default value is 0.'
      - "If not called on quantitative axes, no modification is made to D3's default value."
```

```builder-method
name: wrap
description: Specifies how tick labels will be wrapped.
params:
  - name: wrap
    type: '((wrap: TickWrapBuilder) => void) | null'
    description: A callback that specifies how tick labels will be wrapped, or `null` to unset the wrapping.
```

#### Quantitative axes

```builder-method
name: count
description: Approximately specifies the number of ticks for the axis.
params:
  - name: value
    type: 'number | AxisTimeInterval | null'
    description:
      - "The number of ticks to pass to D3's axis.ticks(), or a time-based frequency of ticks for axes with `Date` values, or null to unset the number of ticks."
      - "Note that this number will be passed to D3's `ticks()` method and therefore it can be an approximate number of ticks."
```

```builder-method
name: spacing
description: Specifies the approximate spacing between ticks, in pixels.
params:
  - name: value
    type: 'number | null'
    description:
      - The spacing between ticks in pixels, or null to unset the spacing.
      - "If not called, the default value is 40. If `count` is set, this value will be ignored."
```

```builder-method
name: values
description: Determines the values that will show up as ticks on the axis.
params:
  - name: values
    type: 'Tick[] | null'
    description: "An array of quantitative values to pass to D3's axis.tickValues(), or null to unset the tick values."
```

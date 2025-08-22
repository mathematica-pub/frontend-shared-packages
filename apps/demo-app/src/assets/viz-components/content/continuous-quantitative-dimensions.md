# Continuous Quantitative Dimensions

Continuous quantitative dimensions create scales that transform data into visual chart properties,
such as a position along an axis, a size, or a color.

These dimensions are used for data that is of type `number` or `Date` and are designed to handle
continuous ranges of values.

There are various continuous quantitative data dimensions that are used for different purposes.

---

## All Continuous Quantitative Dimensions

### Required Methods

The following methods must be called on any continuous quantitative dimension builder to create a
valid configuration object.

```builder-method
name: valueAccessor
description: Specifies how values are derived from `Datum` to be used for establishing properties of the chart.
params:
  - name: valueAccessor
    type: '(datum: Datum) => TOrdinalValue'
    description: 'A function that takes a `Datum` and returns a value of type `string`, `number`, or `Date`.'
```

### Optional Methods

```builder-method
name: domain
description: Specifies the domain of the dimension. If not provided, the domain will be determined by the data.
params:
  - name: domain
    type: '[number, number] | [Date, Date] | null'
    description: 'A two-item array of `number` or `Date` values specifying the minimum and maximum values of the domain.'
```

```builder-method
name: formatFunction
description: A function that will be called to format the values of the dimension.
params:
  - name: formatFunction
    type: '((datum: Datum) => string) | null'
    description: 'A function that takes a `Datum` and returns a value of type `string`.'
```

```builder-method
name: formatSpecifier
description: Sets a format specifier that will be applied to values from this dimension for display purposes, for example, in a tooltip.
params:
  - name: formatSpecifier
    type: 'string | null'
    description: 'A D3 format string (e.g., ".2f" for two decimal places or "%m/%d/%Y" for a date).'
```

## Date Chart Position Dimension

The `DateChartPositionDimensionBuilder` is used to translate `Date` values into a position of a
chart mark along an axis.

### Required Methods

See: required methods on all continuous quantitative dimensions.

### Optional Methods

```builder-method
name: scaleFn
description: Maps values from the dimension's domain to the dimension's range. Defaults to `d3.scaleUtc`.
params:
  - name: scaleFn
    type: '(scaleFn: (domain?: Iterable<Date>, range?: Iterable<number>) => ScaleTime<number, number>) | null'
    description: "A D3 scale function."
```

## Number Chart Position Dimension

The `NumberChartPositionDimensionBuilder` is used to translate numeric values into a position of a
chart mark along an axis.

### Required Methods

See: required methods on all continuous quantitative dimensions.

### Optional Methods

```builder-method
name: domainPaddingPercentOver
description: Adds additional space between data values and the edge of a chart by increasing the max value of the quantitative domain. For example, if the domain is [0, 100] and the percent is 0.1, the new domain will be [0, 110]. Defaults to 0.1.
params:
  - name: domainPaddingPercentOver
    type: 'number'
    description: 'A `number` representing a decimal proportion.'
```

```builder-method
name: domainPaddingPixels
description: Adds additional space between data values and the edge of a chart by increasing the max value of the quantitative domain so that it exceeds its original value by the specified number of pixels. Defaults to `40px`.
params:
  - name: domainPaddingPixels
    type: 'number'
    description: 'A `number` representing a number of pixels.'
```

```builder-method
name: domainPaddingRoundUpToInterval
description: Adds additional space between data values and the edge of a chart by increasing the max value to a number that is rounded up to the specified interval. Defaults to `() => 1`.
params:
  - name: domainPaddingRoundUpToInterval
    type: 'interval: (d: number) => number'
    description: 'A function that takes a `number` value and maps it to a `number` interval.'
```

```builder-method
name: domainPaddingRoundUpToSigFig
description: Adds additional space between data values and the edge of a chart by increasing the max value to a number that is rounded up to the specified number of significant figures. Defaults to `() => 1`.
params:
  - name: domainPaddingRoundUpToSigFig
    type: 'sigFigures: (d: number) => number'
    description: 'A function that takes a `number` value and maps it to a `number` representing number of significant figures.'
```

```builder-method
name: includeZeroInDomain
description: Sets a boolean that indicates whether the domain of the dimension's scale should include zero.
params:
  - name: includeZeroInDomain
    type: 'boolean'
    description: 'A `boolean` indicating whether the domain should include zero.'
```

```builder-method
name: scaleFn
description: Maps values from the dimension's domain to the dimension's range. Defaults to `d3.scaleLinear`.
params:
  - name: scaleFn
    type: '(scaleFn: (domain?: Iterable<number>, range?: Iterable<number>) => ScaleContinuousNumeric<number, number>) | null'
    description: "A D3 scale function."
```

## Number Visual Value Dimension

The `NumberVisualValueDimensionBuilder` is used to translate numeric values into visual values, such
as sizes or colors.

### Required Methods

See: required methods on all continuous quantitative dimensions.

### Optional Methods

```builder-method
name: includeZeroInDomain
description: Sets a boolean that indicates whether the domain of the dimension's scale should include zero. Defaults to `true`.
params:
  - name: includeZeroInDomain
    type: 'boolean'
    description: 'A `boolean` indicating whether the domain should include zero.'
```

```builder-method
name: range
description: Sets a range of visual values that will be the output from [D3's scaleLinear](https://d3js.org/d3-scale/linear#scaleLinear) (for example, this could be a range of colors or sizes). If not provided, a scale must be provided.
params:
  - name: range
    type: '[number, number] | [string, string] | null'
    description: 'A two-item array specifying the minimum and maximum values of the range.'
```

```builder-method
name: scale
description: Allows a user to set a completely custom scale that transforms the value returned by this dimension's `valueAccessor` into a visual value (`string` or `number`). If not provided, a range must be provided. If provided, this will override any values provided to `domain`, `range`, and `scaleFn`.
params:
  - name: scale
    type: '((value: number) => number | string) | null'
    description: 'A function mapping a `number` value to a visual value `number` or `string`.'
```

```builder-method
name: scaleFn
description: Maps values from the dimension's domain to the dimension's range. Defaults to `d3.scaleLinear`.
params:
  - name: scaleFn
    type: '(scaleFn: (domain?: Iterable<number>, range?: Iterable<number | string>) => ScaleContinuousNumeric<number | string, number | string>) | null'
    description: "A D3 scale function."
```

# Ordinal Dimensions

Ordinal dimensions create scales that transform ordinal data into visual chart properties, such as a
position along an axis, a color, or a chart multiple index.

Ordinal dimensions can work with data that is of type `string`, `number`, or `Date`, but `number`
and `Date` values will not be interpreted as continuous values.

There are various ordinal data dimensions that are used for different purposes.

## All Ordinal Dimensions

### Required Methods

The following methods must be called on any ordinal dimension builder to create a valid
configuration object.

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
description: Specifies the domain of the dimension.
params:
  - name: domain
    type: 'string[] | number[] | Date[] | null'
    description: 'An array of values of type `string`, `number`, or `Date`.'
```

```builder-method
name: formatFunction
description: A function that will be called to format the values of the dimension.
params:
  - name: formatFunction
    type: '((datum: Datum) => string) | null'
    description: 'A function that takes a `Datum` and returns a value of type `string`.'
```

## Ordinal Chart Multiple Dimension

The `OrdinalChartMultipleDimensionBuilder` is used to translate ordinal values into an index that
can be used to create chart multiples.

### Methods

This dimension has no required or optional methods beyond those specified for all ordinal
dimensions.

## Ordinal Chart Position Dimension

The `OrdinalChartPositionDimensionBuilder` is used to translate ordinal values into a position of a
chart mark along an axis.

### Required Methods

See: required methods on all ordinal dimensions.

### Optional Methods

```builder-method
name: align
description: Sets the alignment of the ordinal scale and is provided to [D3's align method](https://d3js.org/d3-scale/band#band_align). Defaults to a value of 0.5.
params:
  - name: align
    type: 'number | null'
    description: 'A number between 0 and 1.'
```

```builder-method
name: paddingInner
description: Sets the inner padding of the ordinal scale and is provided to [D3's paddingInner method](https://d3js.org/d3-scale/band#band_paddingInner) (will have no effect if the scale is a point scale). Defaults to a value of 0.1.
params:
  - name: paddingInner
    type: 'number | null'
    description: 'A number between 0 and 1.'
```

```builder-method
name: paddingOuter
description: Sets the outer padding of the ordinal scale and is provided to [D3's paddingOuter method](https://d3js.org/d3-scale/band#band_paddingOuter). Defaults to a value of 0.1.
params:
  - name: paddingOuter
    type: 'number | null'
    description: 'A number between 0 and 1.'
```

## Ordinal Visual Value Dimension

The `OrdinalVisualValueDimensionBuilder` is used to translate ordinal values into visual values,
such as colors or sizes.

### Required Methods

See: required methods on all ordinal dimensions.

### Optional Methods

```builder-method
name: range
description: Sets an array of visual values that will be the output from [D3's scaleOrdinal method](https://d3js.org/d3-scale/ordinal#scaleOrdinal). Will not be used if `scale` is set by the user. Defaults to `d3.schemeTableau10`.
params:
  - name: range
    type: 'number[] | string[] | null'
    description: 'An array of values of type `string` or `number`'
```

```builder-method
name: scale
description: Sets a user-defined function that transforms a categorical value into a visual value. Requires the user to provide their own implementation of `valueAccessor`. If a custom `valueAccessor` function is not provided, this function will not be used even if provided (due to default value of `valueAccessor`).
params:
  - name: scale
    type: '((category: number | Date | string) => number | string) | null'
    description: 'A function that takes a `number`, `Date`, or `string` and returns a value of type `number` or `string`.'
```

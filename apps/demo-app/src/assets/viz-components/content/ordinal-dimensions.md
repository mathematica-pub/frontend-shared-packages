# Ordinal Dimensions

Ordinal dimensions create scales that transform ordinal data into visual chart properties, such as a
position along an axis, a color, or a chart multiple index.

Ordinal dimensions can work with data that is of type `string`, `number`, or `Date`, but `number`
and `Date` values will not be interpretted as continuous values.

There are various ordinal data dimensions that are used for different purposes.

## ALl Ordinal Dimensions

### Required Methods

The following methods must be called on `OrdinalChartPositionDimensionBuilder` to create a valid
configuration object.

```builder-method
name: valueAccessor
description: Specifies how values are derived from `Datum` to be used for establishing properties of the chart.
params:
  - name: valueAccessor
    type: (datum: Datum) => TOrdinalValue
    description: A function that takes a `Datum` and returns a value of type `string`, `number`, or `Date`.
```

### Optional Methods

```builder-method
name: formatFunction
description: 'A function that will be called to format the values of the dimension.'
```

## Ordinal-Chart Position Dimension

### Optional Methods

The `OrdinalChartPositionDimensionBuilder` is used to create ordinal dimensions that are used to set
the position of a chart mark along an axis.

```builder-method

```

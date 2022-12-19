# DataMarks

## Class

**DataMarks**

The DataMarks class is a minimal type signature that should be extended by every component that will furnish data and draw shapes based on that data.

### Required properties - must be set by user

- config: any

### Required methods - must be set by user

- setMethodsFromConfigAndDraw: () => void
- resizeMarks: () => void
- drawMarks: (transitionDuration: number) => void
- onPointerEnter: (event: PointerEvent) => void
- onPointerLeave: (event: PointerEvent) => void
- onPointerMove: (event: PointerEvent) => void

## Token

**DATA_MARKS**

The DATA_MARKS token is used as a type specifier and for Angular's dependency injection.

## DataMarks Config

**DataMarksConfig**

### Required properties - must be set by user

- data: any[]
  - an array of _any_ type that contains values to visualize

### Required properties - with default values

- transitionDuration: number
  - default value: 250
  - defines transition durations within the visualization
- mixBlendMode: string
  - default value: 'normal'
  - defines how overlapping elements are blended

### Optional properties

- showTooltip: boolean
  - used to help determine if a tooltip should be shown on component

## Data Dimension

**DataDimension**

### Required properties - must be set by user

- valueAccessor: (...args: any) => any
  - a method to access the desired value from each item in the _data_ array

### Optional properties

- domain: any
- range: any
- valueFormat: string | (x: number) => string

## Quantitative Dimension

**QuantitativeDimension**

A QuantitativeDimension is a [DataDimension](#data-dimension).

### Required properties - must be set by user

- valueAccessor: (...args: any) => any
  - a method to access the desired value from each item in the _data_ array

### Optional properties

- domain: [any, any]
- range: any
- valueFormat: string
- scaleType: (d: any, r: any) => any

## Ordinal Dimension

**OrdinalDimension**

An OrdinalDimension is a [DataDimension](#data-dimension).

### Required properties - must be set by user

- valueAccessor: (...args: any) => any
  - a method to access the desired value from each item in the _data_ array

### Required properties - with default values

- scaleType: (d: any, r: any) => any
  - default value: [scaleBand](https://github.com/d3/d3-scale/blob/main/README.md#band-scales)
- paddingInner: number
  - default value: 0.1
  - values must be between 0 and 1
  - sets [paddingInner](https://github.com/d3/d3-scale/blob/main/README.md#band_paddingInner) on _scaleBand_, controls padding between marks
- paddingOuter: number
  - default value: 0.1
  - values must be between 0 and 1
  - sets [paddingOuter](https://github.com/d3/d3-scale/blob/main/README.md#band_paddingOuter) on _scaleBand_, controls padding on outside of marks
- align: number
  - default value: 0.5
  - values can be 0, 0.5, or 1
    - 0 aligns marks to the first value in the domain (typically left or bottom)
    - 0.5 aligns marks to the center
    - 1 aligns marks to the last value in the domain (typically right or top)
  - sets [align](https://github.com/d3/d3-scale/blob/main/README.md#band_align)

### Optional properties

- domain: any[]
- range: any
- valueFormat: string

## Categorical Color Dimension

**CategoricalColorDimension**

A CategoricalColorDimension is a [DataDimension](#data-dimension).

### Required properties - must be set by user

- valueAccessor: (...args: any) => any
  - a method to access the desired value from each item in the _data_ array

### Optional properties

- domain: any[]
- range: any
- valueFormat: string
- colorScale: (...args: any) => any
- colors: string[]

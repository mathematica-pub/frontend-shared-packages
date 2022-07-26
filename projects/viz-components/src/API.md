# Data Marks Reference

The Data Marks library is a collection of Angular components that are designed to work together.

- Chart
- Xy Chart Space
- Xy Chart Background
- X Axis
- Y Axis
- Bars
- Grouped Bars
- Stacked Bars
- Lines
- [Map](#map-map-component)
- HTML Tooltip

## [Map (map-component)](https://github.com/mathematica-org/mac-ui-apps/tree/main/projects/charts/src/lib/map)

## Configs

### Bars Config, unravelled

Shows where defaults are set, presumes you just call `new BarsConfig();`. If a property is set by the BarsConfig, it's bolded; else, you can presume that property is a default when BarsConfig calls, e.g., `new OrdinalDimension()`

BarsConfig:

- ordinal: `new OrdinalDimension()`

  - domain: unset; type any[] | InternSet
  - scaleType: scaleBand ([options](https://github.com/d3/d3-scale))
  - paddingInner: 0.1
  - paddingOuter: 0.1
  - align: 0.5
  - valueAccessor: **(d, i) => i**
  - valueFormat: unset, type string, gets passed into d3 format function ([options](https://github.com/d3/d3-format))

- quantitative: `new QuantitativeDimension()`

  - domain: unset, type [any, any]
  - scaleType: **scaleLinear** ([options](https://github.com/d3/d3-scale))
  - valueAccessor: **(d) => d**
  - valueFormat: unset ([options](https://github.com/d3/d3-format))
  - domainPadding: `new DomainPadding()`
    - type: round; options (round, percent, none)
    - sigDigits: 2
    - percent: 0.1

- category: `new CategoricalColorDimension()`

  - valueAccessor: **(d) => d**
  - valueFormat: unset
  - domain: unset; type any[] | InternSet
  - colorScale: unset, random function
  - colors: **['lightslategray']**; type string[]

- dimensions: `verticalBarChartDimensionsConfig`

  - direction: vertical; options (vertical, horizontal)
  - x: ordinal; options (ordinal, quantitative)
  - y: quantitative
  - ordinal: x; options (x, y)
  - quantitative: y
  - quantitativeDimension: height; options (width, height)

- labels: `new LabelsConfig()`

  - show: false
  - offset: 4
  - color: unset, type string
  - noValueString: 'N/A'

- positivePaddingForAllNegativeValues: **0.2**

### Axis Config, unravelled

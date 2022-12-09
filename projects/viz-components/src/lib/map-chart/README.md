# Map

**MapComponent**  
**m-charts-data-marks-map**  
A MapComponent is a DataMarksComponent.

## Map Config

**MapConfig**

A MapConfig is a [DataMarksConfig](https://github.com/mathematica-org/mac-ui-apps/tree/main/projects/charts/src/lib/data-marks#dataMarks-config)

### Required properties - must be set by user

### Required properties - with default values

- data: any[]
  - an array of _any_ type that contains values to visualize
- map: [BaseMapConfig](#basemap-config)
  - default value: new [BaseMapConfig](#basemap-config)()
- - projection: any
  - default value: [geoAlbersUsa](https://github.com/d3/d3-geo#geoAlbersUsa)
- strokeColor: string
  - default value: 'darkgray'
- strokeWidth: string
  - default value: 1

### Optional properties

## BaseMap Config

**BaseMapConfig**

### Required properties - must be set by user

- valueAccessor: (d: any) => any
  - a method to access an identifying name/value on each geography to be rendered. The accessed value must match the value retrieved by _geoAccessor_ on the _GeoDataDimension_.
- boundary: any
- geographies: any[]

## GeoData Dimension

**GeoDataDimension**
A GeoDataDimension is a [DataDimension](https://github.com/mathematica-org/mac-ui-apps/tree/main/projects/charts/src/lib/data-marks#data-dimension)

### Required properties - must be set by user

- valueAccessor: (...args: any) => any
  - a method to access the desired value from each item in the _data_ array
- geoAccessor: (d: any) => any
  - a method to access the name/value of the geography on the data array item. The accessed value must match the value retrieved by _valueAccessor_ on the _BaseMapConfig_.
- valueType: string
- binType: MapBinType
- numBins: number
- colorScale: (...args: any) => any

### Optional properties

- domain
- range
- valueFormat: string
- breakValues: number[]
- colors: string[]
- interpolator: (...args: any) => any

## MapBin Type

**MapBinType**

A type used to define how values will be binned for a choropleth map

### Valid values

- 'none'
  - Color shades will be calculated with a linear scale based on the range of data values
- 'equal value ranges'
  - Bins will be constructed by dividing the range of data values into _numBins_ parts, each of equal size
- 'equal num observations'
  - Bins will be constructed by sorting the data observations by value and dividing them into _numBins_ bins, each with an equal number of observations data
- 'custom breaks'
  - Bins will be constructed according to data values given in the _breakValues_ array. TODO: add note about how array works, i.e. first value is top of first bin, etc.

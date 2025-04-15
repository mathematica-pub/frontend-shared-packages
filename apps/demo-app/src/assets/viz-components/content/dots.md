# Dots Primary Marks Component

## Overview

The `DotsComponent` allows you to create `SvgCircleElement`s within an `XyChart`, positioned and
styled according to four different dimensions of data that control the `cx`, `cy`, `r`, and `fill`
properties of the circles.

While you can use the `DotsComponent` to create a scatterplot, it is not limited to that. Both the x
and y dimensions can be either ordinal or continuous-quantitative dimensions. Using two
continuous-quantitative dimensions will create a scatterplot, but you can also use an ordinal
dimension for one or both of the axes to create other types of charts that also feature circles.

```custom-angular
small examples
```

## Configuration

The `VicDotsConfigBuilder` allows you to create a configuration object for the `DotsComponent`.

It requires one generic type, which should be the type of a single datum in the array of data that
will be passed to the component.

**Required imports from @hsi/viz-components**

```ts
import { VicChartModule, VicDotsConfigBuilder, VicDotsModule } from '@hsi/viz-components';
...
@Component({
  ...
  imports: [
    VicChartModule,
    VicDotsModule
    ...
  ],
  ...
  providers: [
    VicDotsConfigBuilder
    ...
  ]
})
constructor(private dots: VicDotsConfigBuilder<WeatherDatum>) {}
```

**Minimal example of creating a `DotsConfig`**

```ts
...
dotsConfig: DotsConfig<WeatherDatum>;
data: WeatherDatum[];
...
this.dotsConfig = this.dots
  .data(data)
  .radiusNumeric((radiusNumeric) =>
    radiusNumeric.valueAccessor((d) => d.wind).range([2, 8])
  )
  .xNumeric((xNumeric) => xNumeric.valueAccessor((d) => d.tempMax))
  .yNumeric((yNumeric) => yNumeric.valueAccessor((d) => d.precipitation))
  .getConfig();
```

### Required Methods

The following methods must be called on `VicDotsConfigBuilder` to create a valid configuration
object.

```builder-method
name: data
description: Sets the data to be used by the component.
params:
  - name: data
    type: Datum[]
    description: The array of data objects to be used by the component.
```

```builder-method
overview: One of the following methods must be called to set the x position of the circles.
methods:
  - name: xDate
    description: Create the specifications for the x position of the circles using Date values.
    params:
      - name: x
        type: '(x: DateChartPositionDimensionBuilder<Datum>) => void'
        description: A callback that allows for specification of how Date values will be transformed into x position values to be used for the cx attribute for circles.
  - name: xNumeric
    description: Create the specifications for the x position of the circles using number values.
    params:
      - name: x
        type: '(x: NumberChartPositionDimensionBuilder<Datum>) => void'
        description: A callback that allows for specification of how number values will be transformed into x position values to be used for the cx attribute for circles.
  - name: xOrdinal
    description: Create the specifications for the x position of the circles using ordinal (string, number or Date) values.
    params:
      - name: x
        type: '(x: OrdinalChartPositionDimensionBuilder<Datum, Domain>) => void'
        description: A callback that allows for specification of how ordinal values will be transformed into x position values to be used for the cx attribute for circles.
```

```builder-method
overview: One of the following methods must be called to set the y position of the circles.
methods:
  - name: yDate
    description: Create the specifications for the y position of the circles using Date values.
    params:
      - name: y
        type: '(y: DateChartPositionDimensionBuilder<Datum>) => void'
        description: A callback that allows for specification of how Date values will be transformed into y position values to be used for the cy attribute for circles.
  - name: yNumeric
    description: Create the specifications for the y position of the circles using number values.
    params:
      - name: y
        type: '(y: NumberChartPositionDimensionBuilder<Datum>) => void'
        description: A callback that allows for specification of how number values will be transformed into y position values to be used for the cy attribute for circles.
  - name: yOrdinal
    description: Create the specifications for the y position of the circles using ordinal (string, number or Date) values.
    params:
      - name: y
        type: '(y: OrdinalChartPositionDimensionBuilder<Datum, Domain>) => void'
        description: A callback that allows for specification of how ordinal values will be transformed into y position values to be used for the cy attribute for circles.
```

### Optional Methods

```builder-method
name: 'class'
description: 'Sets the class attribute for each dot.'
params:
  - name: 'class'
    type: '((d: Datum) => string) | string | null'
    description: A string value for the `class` attribute of the `SVGGElement` for each dot.
```

```builder-method
overview: One of the following methods can be called to set the fill color of the circles. If no method is called, the default fill color is `lightgray`.
methods:
  - name: fill
    description: Set the fill color for all circles from a string.
    params:
      - name: fill
        type: string | null
        description: A named HTML color ('red') or hex code '#ff0000' value for the fill attribute for all circles.
  - name: fillCategorical
    description: Create the specifications for the fill color of the dots using string values.
    params:
      - name: fillCategorical
        type: '((fill: OrdinalVisualValueDimensionBuilder<Datum, string, string>) => void) | null'
        description: A callback that allows for specification of how categorical values will be transformed into string values (named HTML colors or hex codes) to be used as values for the fill attribute for circles.
  - name: fillNumeric
    description: Create the specifications for the fill color of the dots using number values.
    params:
      - name: fillNumeric
        type: '((fill: OrdinalVisualValueDimensionBuilder<Datum, number, string>) => void) | null'
        description: A callback that allows for specification of how numeric values will be transformed into string values (named HTML colors or hex codes) to be used as values for the fill attribute for circles.
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
name: opacity
description: Sets the opacity for each dot. If not called, the default opacity is 1.
params:
  - name: opacity
    type: number | null
    description: A value between 0 and 1 for the `opacity` attribute of the `SVGCircleElement`.
```

```builder-method
overview: One of the following methods can be called to set the radius of the circles. If no method is called, the default radius is 2.
methods:
  - name: radius
    description: Set the radius value for all circles from a number.
    params:
      - name: radius
        type: number | null
        description: A number that will be used as the r attribute for all circles.
  - name: radiusCategorical
    description: Create the specifications for the radius of the dots using string values.
    params:
      - name: radiusCategorical
        type: '((radius: OrdinalVisualValueDimensionBuilder<Datum, string, string>) => void) | null'
        description: A callback that allows for specification of how categorical values will be transformed into numbers to be used as values for the r attribute for circles.
  - name: radiusNumeric
    description: Create the specifications for the radius of the dots using number values.
    params:
      - name: radiusNumeric
        type: '((radius: OrdinalVisualValueDimensionBuilder<Datum, number, string>) => void) | null'
        description: A callback that allows for specification of how numeric values will be transformed into numbers to be used as values for the the r attribute for circles.
```

```builder-method
name: stroke
description: Sets the stroke attributes for each dot.
params:
  - name: stroke
    type: '((stroke: StrokeBuilder) => void) | null'
    description: A callback that allows for the specification of the attributes for the stroke of the dots.
```

## Example with code files

```custom-angular
main example
```

# Bars Primary Marks Component

## Overview

The `BarsComponent` allows you to create `SvgRectElement`s within an `XyChart`, positioned and
styled according to up to three dimensions of data that control the ordering of the bars, the length
of the bars, and, optionally, the fill color of the bars.

```custom-angular
small examples
```

## Configuration

The `VicBarsConfigBuilder` allows you to create a configuration object for the `BarsComponent`.

It requires two generic types. This first should be the type of a single datum in the array of data
that will be passed to the component. The second should be the type of the the values for the
ordinal dimension, which could be a `string`, `number`, or `Date`, though is most commonly a
`string`. (For example this value would serve as a label to identify each bar.)

**Required imports from @hsi/viz-components**

```ts
import { VicBarsConfigBuilder, VicBarsModule, VicChartModule, VicXyChartModule } from '@hsi/viz-components';
...
@Component({
  ...
  imports: [
    VicChartModule,
    VicXyChartModule,
    VicBarsModule
    ...
  ],
  ...
  providers: [
    VicBarsConfigBuilder
    ...
  ]
})
constructor(private bars: VicBarsConfigBuilder<MetroUnemploymentDatum, string>) {}
```

**Minimal example of creating a `BarsConfig`**

```ts
...
barsConfig: BarsConfig<MetroUnemploymentDatum, string>;
data: MetroUnemploymentDatum[];
...
this.barsConfig = this.bars
  .data(this.data)
  .horizontal((bars) =>
    bars
      .x((x) => x.valueAccessor((d) => d.value))
      .y((y) => y.valueAccessor((d) => d.division))
  )
  .color((color) => color.range(['teal']))
  .getConfig();
```

### Required Methods

The following methods must be called on `VicBarsConfigBuilder` to create a valid configuration
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
overview: One of the following methods must be called to set the orientation of the bars.
methods:
  - name: horizontal
    description: Sets the orientation of the bars to horizontal.
    params:
      - name: bars
        type: '((bars: HorizontalBarsDimensionsBuilder<Datum, OrdinalDomain>) => void) | null'
        description: 'A function that sets orientation of the bars to horizontal and accepts additional configuration for the bars.'
  - name: vertical
    description: Sets the orientation of the bars to vertical.
    params:
      - name: bars
        type: '((bars: VerticalBarsDimensionsBuilder<Datum, OrdinalDomain>) => void) | null'
        description: 'A function that sets orientation of the bars to vertical and accepts additional configuration for the bars.'
```

```builder-method
name: x
description: 'Specifies how values derived from `Datum` set the x domain of the chart, and how those values are displayed. _Called from within the `horizontal` or `vertical` orientation functions._'
params:
  - name: x
    type: '(x: (dimension: OrdinalChartPositionDimensionBuilder<Datum, TOrdinalValue>) => void) | x: (dimension: NumberChartPositionDimensionBuilder<Datum>) => void)'
    description: 'If called from the `horizontal` orientation method, a function that specifies how quantitative values (of type `number`) will be used in the chart. If called from the `vertical` orientation method, a function that specifies how ordinal values (may be of type `string`, `number` or `Date`, thought typically `string`) will be used in the chart.'
```

```builder-method
name: y
description: 'Specifies how values derived from `Datum` set the y domain of the chart, and how those values are displayed. _Called from within the `horizontal` or `vertical` orientation functions._'
params:
  - name: y
    type: '(y: (dimension: OrdinalChartPositionDimensionBuilder<Datum, TOrdinalValue>) => void) | y: (dimension: NumberChartPositionDimensionBuilder<Datum>) => void)'
    description: 'If called from the `horizontal` orientation method, a function that specifies how ordinal values (may be of type `string`, `number` or `Date`, thought typically `string`) will be used in the chart. If called from the `vertical` orientation method, a function that specifies how quantitative values (of type `number`) will be used in the chart.'
```

### Optional Methods

```builder-method
name: backgrounds
description: Specifies properties of bars to be drawn behind the bars that represent data values. The background bars span the full width of the chart.
params:
  - name: backgrounds
    type: '(backgrounds: BarsBackgroundsBuilder) => void | null'
    description:
      - 'A function that specifies the color of background bars and whether they respond to events, or null to unset the background bars.'
      - 'If called with no arguments, the default background will be `whitesmoke` and events will be `false`.'
      - If not called, no background bars will be created.
```

```builder-method
name: color
description: 'Specifies how values derived from `Datum` (of type `string`) set the color of the bars, and how those values are displayed.'
params:
  - name: color
    type: '((color: OrdinalVisualValueDimensionBuilder<Datum, string, string>) => void) | null'
    description:
      - 'A function that specifies how values derived from `Datum` will be used to set the color of the bars, or null to unset the color.'
      - 'If not called, all bars will be colored with the first color in `d3.schemeTableau10`, the default `range` color scale.'
```

```builder-method
name: customFills
description: 'Determines custom fills for specified bars. Intended to be used with a user-provided fill in <defs> (provided in html) whose `id` is referenced here as `defId`. The `shouldApply` function is used to determine whether the fill should be applied to a given datum.'
params:
  - name: customFills
    type: 'values: FillDefinition<Datum>[] | null'
    description:
      - 'An array of custom fills ({ defId: string; shouldApply: (d: Datum) => boolean;}[]), or `null` to unset the custom fills.'
      - 'This will override any fill set by the `color` dimension.'
```

```builder-method
name: labels
description: 'Specifies properties of labels to be rendered at the end of bars, typically used to show bar values.'
params:
  - name: labels
    type: '(labels: LabelsBuilder<Datum>) => void | null'
    description:
      - 'A function that specifies properties for the labels, or `null` to unset the labels.'
      - 'If not called, no labels will be created.'
```

## Example with code files

```custom-angular
main example
```

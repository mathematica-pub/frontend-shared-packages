# Chart

## Overview

Each Viz Components chart that a user makes requires an outer `ChartComponent`, or a component that
extends `ChartComponent`, such as `XyChartComponent` or `MapChartComponent`.

```html
<vic-chart [config]="config"> <-- chart content goes here --> </vic-chart>
```

Under the hood, the chart component creates the chart's SVG, and it also hosts scales for the chart
that child components can access and subscribe to.

## Configuration

To provide a configuration for a `ChartComponent`, you can use the `VicChartConfigBuilder`.

**Required imports from @hsi/viz-components**

```ts
import { VicChartsConfigBuilder, VicChartModule } from '@hsi/viz-components';
...
@Component({
  ...
  imports: [
    VicChartModule,
    ...
  ],
  ...
  providers: [
    VicChartConfigBuilder
    ...
  ]
})
constructor(private chart: VicChartConfigBuilder) {}
```

**Minimal example of creating a `ChartConfig`**

```ts
...
chartConfig: ChartConfig;
...
this.chartConfig = this.chart.getConfig();
```

### Required Methods

There are no required methods for the `VicChartConfigBuilder`. The entire configuration may also be
omitted, in which case the chart will use default values as documented below.

### Optional Methods

```builder-method
name: height
description: If chart size is dynamic, determines the maximum height of the chart. In this case, this value is also used to determine the aspect ratio of the chart which will be maintained on resizing. If chart size is static, the fixed height of the chart.
params:
  - name: value
    type: 'number | null'
    description:
      - The maximum height of the chart, in px.
      - If chart size is static, the fixed height of the chart.
      - If not called or called with `null`, a default value of 600 will be used.
```

```builder-method
name: margin
description: "Determines the margin that will be established between the edges of the svg and the svg's contents, in px."
params:
  - name: margin
    type: '{ top: number, right: number, bottom: number, left: number }'
    description:
      - "The margin that will be established between the edges of the svg and the svg's contents, in px."
      - 'If called with null, a default value of `{ top: 36, right: 36, bottom: 36, left: 36 }` will be used.'
```

```builder-method
name: resize
description: 'Determines whether the chart size is fixed or will resize as the container width changes sizes, and how this resizing will be done.'
params:
  - name: value
    type: 'Partial<{ width: boolean; height: boolean; useViewbox: boolean }> | null'
    description:
      - 'An object with up to three properties: `width`, `height`, and `useViewbox`. Can also be called with null to reset the resize configuration to its default value, which is `{ width: true, height: true, useViewbox: false }`.'
      - 'If `useViewbox` is true, the chart will resize via the viewbox attribute, scalling all contents of the chart at once. (For example, as the chart grows smaller, svg text in the chart will also grow proportionally smaller.) This is a more performant way to resize the chart.'
      - 'If `useViewbox` is false, the chart will resize by changing the width and height attributes of the svg element, recalculating scales and re-rendering the chart. This is a less performant way to resize the chart but may be necessary in some cases, particularly when the chart contains elements like text that should not be resized.'
      - "If `useViewbox` is false, `width` and `height` can be used to determine which dimensionss will resize when the chart's container changes width. If both are true, the chart will resize in both dimensions. If only one is true, the chart will resize in that dimension only. Note that the chart does not respond to changes in container height."
      - Note that the chart does not respond to changes in container height.
```

```builder-method
name: transitionDuration
description: Sets the duration of transitions in the chart.
params:
  - name: value
    type: 'number | null'
    description:
      - The duration of transitions in milliseconds.
      - 'If not called or called with null, a default value of 250 will be used.'
```

```builder-method
name: width
description: If chart size is dynamic, sets the maximum width of the chart. In this case, this value is also used to determine the aspect ratio of the chart which will be maintained on resizing. If chart size is not dynamic, sets the fixed width of the chart..
params:
  - name: width
    type: 'number | null'
    description:
      - The maximum width of the chart, in px.
      - If chart size is static, the fixed width of the chart.
      - 'If not called or called with `null`, a default value of 800 will be used.'
```

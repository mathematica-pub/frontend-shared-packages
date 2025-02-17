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

```ts
import { VicChartsConfigBuilder } from '@hsi/viz-components';
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

### Required Methods

There are no required methods for the `VicChartConfigBuilder`. The entire configuration may also be
omitted, in which case the chart will use default values as documented below.

### Optional Methods

```builder-method
name: height
description: If chart size is dynamic, sets the maximum height of the chart. In this case, this value is also used to determine the aspect ratio of the chart which will be maintained on resizing. If chart size is static, the fixed height of the chart. The default value is 600.
params:
  - name: height
    type: number
    description: The height of the chart in pixels.
```

```builder-method
name: margin
description: "Sets the margin that will be established between the edges of the svg and the svg's contents. The default value is `{ top: 36, right: 36, bottom: 36, left: 36 }`."
params:
  - name: margin
    type: { top: number, right: number, bottom: number, left: number }
    description: The margin object with top, right, bottom, and left properties, in px.
```

```builder-method
name: resize
description: Determines whether the chart size is fixed or will resize as the container width changes sizes, and how this resizing will be done. The default value is `{ width: true, height: true, useViewbox: true }`.
params:
  - name: resize
    type: "Partial<{ width: boolean; height: boolean; useViewbox: boolean }>"
    description:
      - "If `useViewbox` is true, the chart will resize via the viewbox attribute, scalling all contents of the chart at once. (For example, as the chart grows smaller, svg text in the chart will also grow proportionally smaller.) This is a more performant way to resize the chart."
      - "If `useViewbox` is false, the chart will resize by changing the width and height attributes of the svg element, recalculating scales and re-rendering the chart. This is a less performant way to resize the chart but may be necessary in some cases, particularly when the chart contains elements like text that should not be resized."
      - "If `useViewbox` is false, `width` and `height` can be used to determine which dimensionss will resize when the chart's container changes width. If both are true, the chart will resize in both dimensions. If only one is true, the chart will resize in that dimension only. Note that the chart does not respond to changes in container height."
```

```builder-method
name: transitionDuration
description: Sets the duration of transitions in the chart. The default value is 250.
params:
  - name: duration
    type: number
    description: The duration of transitions in milliseconds.
```

```builder-method
name: width
description: If chart size is dynamic, sets the maximum width of the chart. If chart size is static, the fixed width of the chart. The default value is 800.
params:
  - name: width
    type: number
    description: The width of the chart in pixels.
```

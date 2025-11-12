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

**Required imports from @mathstack/viz**

```ts
import { VicChartsConfigBuilder, VicChartModule } from '@mathstack/viz';
...
@Component({
  ...
  imports: [VicChartModule],
  providers: [VicChartConfigBuilder],
})
constructor(private chart: VicChartConfigBuilder) {}
```

**Minimal example of creating a `ChartConfig`**

```ts
chartConfig: ChartConfig;

this.chartConfig = this.chart.getConfig();
```

### Required Methods

There are no required methods for the `VicChartConfigBuilder`. The entire configuration may also be
omitted, in which case the chart will use default values as documented below.

### Optional Methods

```builder-method
name: aspectRatio
description: Explicitly sets the aspect ratio (width / height) when `responsive-width` is used without fixedHeight.
params:
  - name: value
    type: 'number'
    description:
      - 'Used only when `scalingStrategy` is `responsive-width` and `fixedHeight` is false.'
      - 'Overrides default derived aspect ratio from maxWidth / maxHeight.'
```

```builder-method
name: fixedHeight
description: Locks the chart height even in `responsive-width` mode.
params:
  - name: value
    type: 'boolean'
    description:
      - 'Only used when `scalingStrategy` is `responsive-width`.'
      - 'If true, height will be fixed to the value provided in `.maxHeight(...)` and not derived from aspect ratio.'
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
name: maxHeight
description: Sets the maximum or fixed height of the chart.
params:
  - name: value
    type: 'number | null'
    description:
      - 'If scalingStrategy is `fixed`, this sets the fixed chart height.'
      - 'If scalingStrategy is `responsive-width`, this is used to compute aspect ratio or as the fixed height if `.fixedHeight(true)` is also used.'
      - 'If null or not set, a default height of 600px is used.'
```

```builder-method
name: maxWidth
description: Sets the maximum or fixed width of the chart.
params:
  - name: value
    type: 'number | null'
    description:
      - 'If scalingStrategy is `fixed`, this sets the fixed chart width.'
      - 'If scalingStrategy is `responsive-width`, this is the maximum width the chart will grow to.'
      - 'If null or not set, a default width of 800px is used.'
```

```builder-method
name: scalingStrategy
description: Determines how the chart scales in response to container size or layout changes.
params:
  - name: value
    type: "'fixed' | 'responsive-width' | 'viewbox'"
    description:
      - 'Determines the primary layout behavior of the chart.'
      - "`fixed`: Chart dimensions remain constant using explicit width and height."
      - "`responsive-width`: Chart width responds to container width; height is derived from aspect ratio or fixed if `.fixedHeight(true)` is called."
      - "`viewbox`: Chart scales entirely via CSS and SVG viewBox. All resizing behavior is browser-driven."
```

```builder-method
name: transitionDuration
description: Sets the duration of transitions in the chart.
params:
  - name: value
    type: 'number | null'
    description:
      - 'The duration of transitions in milliseconds.'
      - 'If not called or called with null, a default value of 250 will be used.'
```

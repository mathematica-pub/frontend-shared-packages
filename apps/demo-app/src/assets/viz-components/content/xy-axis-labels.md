# XY Axis Labels

## Overview

User can user the `labels` method on one of the axis builders to add and configure labels for that
axis.

Axis labels are centered on their respective axes by default, with the y-axis label rotated 90
degrees. Users can configure positioning of the labels using the `position` and `anchor` methods.
The `offset` method can be used to fine-tune the position of the label. Labels can also be wrapped
to multiple lines using the `wrap` method.

```custom-angular
small axis labels examples
```

```ts
// x-axis label with default settings
this.xQuantitativeAxis.label((label) => label.text('wind speed (mph)')).getConfig();

// y-axis label with default settings
this.yQuantitativeAxis.label((label) => label.text('precipitation (in)')).getConfig();

// x-axis label with custom positioning and wrapping
this.xQuantitativeAxis
  .label((label) =>
    label
      .text('wind speed (mph)')
      .position('end')
      .wrap((wrap) => wrap.width(60))
  )
  .getConfig();

// y-axis label with custom positioning
this.yQuantitativeAxis
  .label((label) =>
    label.text('precipitation (in)').position('start').anchor('start').offset({ x: 8, y: 8 })
  )
  .getConfig();
```

## Configuration

### Required Methods

```builder-method
name: text
description: Sets the text for the axis label.
params:
  - name: text
    type: string
```

### Optional Methods

```builder-method
name: anchor
description: Positions the text relative to the label position. If not specified, the default value is 'middle'.
params:
  - name: anchor
    type: "'start' | 'middle' | 'end'"
    description: The value for the `text-anchor` attribute for the label. The value 'start' will align the start of the text to the label position, 'middle' will align the middle of the text to the label position, and 'end' will align the end of the text to the label position.
```

```builder-method
name: offset
description: 'Sets the offset of the label from where the label is otherwise located. Allows for fine-tuning the position of the label. If not specified, the default value is { x: 0, y: 0 }.'
params:
  - name: offset
    type: '{ x: number, y: number }'
    description:
      - The offset of the label applied after the label is positioned by `position` and `anchor`. The `x` value is the horizontal offset, and the `y` value is the vertical offset.
      - Positive y values will move the label down, positive x values will move the label to the right. If not provided, labels parallel to the axis will be placed at the far extent of the margin.
      - Labels perpendicular to the axis will be placed at the axis line. The latter will likely need an offset.
```

```builder-method
name: position
description: Sets the position of the label relative to the length of axis. If not specified, the default value is 'middle' for both horizontal and vertical axes.
params:
  - name: position
    type: "'start' | 'middle' | 'end'"
    description:
      - If the axis is horizontal, 'start' aligns the label to the left, 'middle' aligns the label to the center, and 'end' aligns the label to the right.
      - If the axis is vertical, 'start' aligns the label to the top, 'middle' aligns the label to the center, and 'end' aligns the label to the bottom.
      - If the axis is vertical, labels with a 'middle' position will be rotated 90 degrees.
```

```builder-method
name: wrap
description: Wraps the text of the label to fit within the specified width. If not specified, the default value is false.
params:
  - name: wrap
    type: '(wrap: SvgTextWrapBuilder) => void'
    description: A function that configures the wrapping of the text.
```

# XY Axis Labels

## Overview

## Builder

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

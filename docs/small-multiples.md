Note: This is not written in the correct place. This eventually belongs in some small multiples page
in the demo app.

# Small Multiples Design Considerations

We currently only support small multiple charts where each chart is its own SVG. This approach makes
it easier to extend library support to:

- Sticky charts/axes
- Built in grid faceting (https://ggplot2.tidyverse.org/reference/facet_grid.html)
- Small screen bar labels (easiest with HTML bar labels where each bar is a separate SVG)

Scales are set per SVG currently. To extend support to the above items, we may explore scale
sharing.

## Layout Options

There are three options for small multiple layouts:

1. Fixed dimensions + CSS grid: Charts move to the next row when the page gets narrower
2. Fixed number of charts: Charts scale (get smaller) when the page gets narrower
3. Hybridize with breakpoints

We only support option <<insert option here>>.

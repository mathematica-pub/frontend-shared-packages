[0.0.71](https://github.com/mathematica-org/viz-components/releases/tag/0.0.71)

## 2.1.0

Previous behavior: `display` property in lines config took `boolean`. This property was never
actually used.

Current behavior: `display` property in lines config takes `boolean | () => boolean`. This property
is used to decide if the `pointMarker` dot should be `display: none` (hidden from view) or
`display: null` (drawn on chart). Interaction effects can update the display of whichever
pointMarkers they would like.

(Incidentally, this allowed us to remove the `hoverDot` property. If you want to have a single
hoverDot and no pointMarkers display in normal chart view, simply call
`createPointMarkers((markers) => markers.display(false))`)

See https://github.com/mathematica-org/frontend-shared-packages/pull/347#discussion_r1724128379 for
examples beyond the update to `lines-example.component.ts` in the demo app.

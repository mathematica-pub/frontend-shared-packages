### A library of composable components for data visualization

Viz Components is a library of Angular components built on top of D3 that can be composed by a user to create custom visualizations. Viz Components takes care of common data viz functionality under the hood, such as setting scales, creating axes, and responsively scaling svgs. At the same time Viz Compenents allows the user to fully customize the system of visual marks used to represent data.

## Library concepts

### Chart + DataMarks

To create a visualization with Viz Components, a user needs to compose their own chart, created from a minimum of one `Chart` component and one `DataMarks` component.

A very simple HTML implementation of a full chart could look like this

```html
<vic-xy-chart [margin]="margin" [height]="height" [width]="width">
  <svg:g svg-elements data-marks-bars [config]="dataMarksConfig"><svg:g>
</vic-xy-chart>
```

The library offers multiple components that are `Chart`s, such as `XyChartComponent` and `MapChartComponent` as well as multiple `DataMarks` components, such as `BarsComponent`, `LinesComponent`, and `GeographiesComponent`. Some `DataMarks` components must be used in conjunction with specific `Chart` components.

A `Chart` component contains a single `<div>` that wraps a single `<svg>`, with content projection slots before and after the `<div>`, and between the opening and closing tags of the `<svg>`.

The D3 scales used to create the visualization are properties of the `Chart` component, and are used to scale the svg dynamically with the dimensions of the wrapper `<div>`.

Those scales, however, are set using the data and instructions that the user provides in the `DataMarks` component's `config` input property. All other Viz Components (or user-developed components) that a user projects into the content projection slots will have access to these scales and can use them to create other elements of a data visualization.

There is no limit to what can be projected into the `Chart` component's content-projection slots, but a `Chart` may have only one `DataMarks` components.

### Data and Styling

At minimum, the user must supply the `DataMarks` component with a `DataMarksConfig` that provides `data` (any[]), and value accessor functions for each of the components' required dimensions that tell the component how to find values for each dimension from a `data` array element -- typically an object with properties. Note that properties that have no relation to the data visualization may remain on the object without consequence.

The library provides minimal default styles for all components in the library, from `DataMarks` components to add-on components such as axis components. Users may overwrite these style properties with their own in each component's `config`.

## Using the library

### Installation

1.  set your aws credentials (found in `~/.aws/credentials`)
2.  `aws codeartifact login --tool npm --domain shared-package-domain --repository shared-package-repository --domain-owner 922539530544 --namespace @web-ast`
3.  `npm install @web-ast/viz-components`

### Custom Schematics

After installing the library, run `ng g viz-components:extend` and follow the instructions from there.

### Code Snippets

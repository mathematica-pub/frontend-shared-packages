## Introduction

Viz Components is a library of Angular components for building highly custom data visualizations, built on top of [D3](https://d3js.org/).

Viz Components allows users to compose sub-chart level components into custom data visualizations and to fully customize the system of visual marks used to represent data. At the same time, takes care of common data viz functionality, such as setting scales, creating axes, and responsively scaling svgs under the hood.

## Getting Started

### System Requirements

Viz Components requires the following:

- Node v16.4 or higher
- npm
- Angular v16 or higher
- AWS cli

### Installing the library

Viz Components is hosted in a private repository on AWS. In order to add it to a project as a dependency or to update it, you'll need to follow the steps below:

#### Update your AWS credentials locally

Your credentials can be found locally on your machine in `~/.aws/credentials`. You can use credentials from any Mathematica AWS account. Your credentials will last 24 hrs.

#### Use the AWS CLI to authenticate to the remote repository

```
aws codeartifact login --tool npm --domain shared-package-domain --repository shared-package-repository --domain-owner 922539530544 --namespace @hsi
```

#### Install the library with npm

```
npm install @hsi/viz-components
```

## Creating a visualization

To create a new visualization using Viz Components in your Angular application, you will need to compose Viz Components's components in the template of an Angular component in your application, and create configuration objects for those components in your component's `.ts` file.

### Composing components

Viz Components is designed so that

## Library concepts

### Chart + DataMarks

To create a visualization with Viz Components, a user needs to compose their own chart, created from a minimum of one `Chart` component and one `DataMarks` component.

Conceptually, a `Chart` component is a shell that handles scaling the visualization, while a `DataMarks` component draws from a user-provided array of data to set scales and create svg elements in the DOM.

A very simple HTML implementation of a full chart could look like this

```html
<vic-xy-chart [margin]="margin" [height]="height" [width]="width">
  <svg:g svg-elements vic-data-marks-bars [config]="dataMarksConfig"><svg:g>
</vic-xy-chart>
```

The library offers multiple `Chart` components, such as `XyChartComponent` and `MapChartComponent` as well as multiple `DataMarks` components, such as `BarsComponent`, `LinesComponent`, and `GeographiesComponent`. Some `DataMarks` components must be used in conjunction with specific `Chart` components.

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
2.  `aws codeartifact login --tool npm --domain shared-package-domain --repository shared-package-repository --domain-owner 922539530544 --namespace @hsi`
3.  `npm install @hsi/viz-components`

### Advanced usage: Extending the library in a project-specific way

We've semi-helpfully created some custom schematics that will set you up with a component that extends whatever viz-components internal thing you care about. Run `ng g @hsi/viz-components:extend` and follow the instructions from there.

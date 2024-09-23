# Viz Components

Viz Components is a library of Angular components for building highly custom data visualizations,
built on top of [D3](https://d3js.org/).

Viz Components allows users to compose sub-chart level components into custom data visualizations
and to fully customize the system of visual marks used to represent data. At the same time, this
package takes care of common data viz functionality, such as setting scales, creating axes, and
responsively scaling svgs under the hood.

## Getting Started

### System Requirements

Viz Components requires the following:

- Node v16.4 or higher
- npm
- Angular v16 or higher
- AWS cli

### Installing the library

Viz Components is hosted in a private repository on AWS. In order to add it to a project as a
dependency or to update it, you'll need to follow the steps below:

#### Update your AWS credentials locally

Your credentials can be found locally on your machine in `~/.aws/credentials`. You can use
credentials from any Mathematica AWS account. Your credentials will last 24 hrs.

#### Use the AWS CLI to authenticate to the remote repository

```bash
aws codeartifact login --tool npm --domain shared-package-domain --repository shared-package-repository --domain-owner 922539530544 --namespace @hsi
```

#### Install the library with npm

```bash
npm install @hsi/viz-components
```

## Library Fundamentals

To create a new visualization using Viz Components in your Angular application, you will need to
compose Viz Components's components in the template of an Angular component in your application, and
create configuration objects for those components in your component's `.ts` file.

The Viz Components `Chart` component create a chart's svg and makes chart scales available to any
child components that are added to its projection slots. All visualizations should start with a
`Chart` type component, which includes the `Xy Chart` (for charts that have x and y dimensions) and
the `Map Chart` (for charts that draw geographies with a projection).

To create a functional visualization, a user must also provide one `PrimaryMarks` component within a
`ChartComponent` projection slot. `PrimaryMarks` components are selected components within the
library that not only draw marks based on user-provided data and configuration specifications, but
that also set the scales on the `ChartComponent`, using either the provided data or any custom
domain values a user provides in the configuration.

Examples of `PrimaryMarks` components include `Bars`, `Lines`, `Geographies`, `Stacked Areas`, and
`Stacked Bars`.

In the HTML, a minimal implementation of a visualization might look like this. Note how the child
`Bars` component is between the tags of the parent `XyChart` component.

```html
<vic-xy-chart [margin]="margin" [height]="height" [width]="width">
  <svg:g svg-elements vic-primary-marks-bars [config]="PrimaryMarksConfig"><svg:g>
</vic-xy-chart>
```

### Adding additional SVG elements to a visualization

The marks drawn by `PrimaryMarks` components can be highly customized through their configuration
objects.

However, users can also add additional marks/svg elements to the chart by adding additional
components (or svg code) in the `ChartComponents` projection slots. Any component used inside the
`ChartComponent` will have access to the scales on the Chart, and can draw additional elements in
the svg using those scales.

The library provides users with an abstract `AuxMarks` class that with automatically subscribe to
the chart scales and call an abstract `drawMarks` method when the scales update. Users can extend
this class to create their own components, and the library also provides several premade `AuxMarks`
components that provide common visualization functionality, such as drawing a rule to mark a
specific quantitative value. Data can be used to generate svg elements in `AuxMarks` components as
well, but that data will not affect the global scales at the chart level.

### Providing configurations

Each viz-components _component_ that accepts any user input will have one `@Input` property called
`config`. Users can generate these configs using builder classes that the library provides to easily
and correctly construct configs for the components. The library provides the following builders:

#### For Data Marks Components

- `VicBarsBuilder`
- `VicGeographiesBuilder`
- `VicGroupedBarsBuilder`
- `VicLinesBuilder`
- `VicStackedAreaBuilder`
- `VicStackedBarsBuilder`

#### For Axis Components

- `VicXOrdinalAxisBuilder`
- `VicXQuantitativeAxisBuilder`
- `VicYOrdinalAxisBuilder`
- `VicYQuantitativeAxisBuilder`

#### Other

- `VicHtmlTooltipBuilder`

The builders provide a set of chainable methods that allow the user to specify the properties of the
config. Methods may be called in any order, but the user must call the `build` method at the end of
the chain to get the configuration object to pass to the Data Marks component.

Methods on the builder that have the name of a property can be used to set that property though the
method's argument. Methods that start with a verb such as `create` or `set` require the user to pass
a function that will be called with the property as an argument. Many of these methods allow the
user to configure data dimensions, such as a quantitative or ordinal dimension, or for geographies,
layers.

_Example_

```ts
this.barsBuilder
  .orientation('horizontal')
  .data(data)
  .createQuantitativeDimension((dimension) => dimension.valueAccessor((d) => d.value))
  .createOrdinalDimension((dimension) => dimension.valueAccessor((d) => d.state))
  .createCategoricalDimension((dimension) =>
    dimension.valueAccessor((d) => d.fruit).range(['red', 'blue'])
  )
  .createLabels((labels) => labels.noValueFunction(() => 'no value'))
  .build();
```

There are two different methods for instantiating a config builder.

Generally, we recommend that users access the config builders by providing them in the providers
array of a component and then declaring in the component's constructor, as shown in the code block
below. We recommend this because we anticipate that this method will feel more familiar to most
developers, as it better matches Angular application development patterns as well as the patterns
using most modern JavaScript libraries, and will create a more seamless development experience.

However, if this approach is used, _the config must be supplied to its corresponding component as an
observable or alias of an observable_, so that changes are detected in this object in the target
component.

_Using providers array_

```ts
import { VicLinesBuilder } from '@hsi/viz-components';

@Component({
  ...
  providers: [
    VicLinesBuilder,
  ],
})
export class MyAppLinesComponent {

  constructor(private linesBuilder: VicLinesConfigBuilder) {}

  getConfig(): LinesConfig {
    const config = this.linesBuilder
      ...
      .getConfig();
  }
}
```

Alternately, users can `new` a config builder themselves, as shown below.

_New-ing the class_

```ts
import { VicLinesBuilder } from '@hsi/viz-components';

export class MyAppLinesComponent {

  constructor() {}

  getConfig(): LinesConfig {
    const linesBuilder = new VicLinesConfigBuilder();
    const config = linesBuilder
      ...
      .getConfig();
  }
}
```

#### Builder classes are stateful

Note that builders are stateful classes.

If you create a single instance of the builder class in your component by injecting vis the
constructor, set 5 properties, call `build`, and then at a later time set only one additional
property, your original 5 properties will be retained. In this case, and in all cases, you will need
to called `build` for your changes to be applied.

If you create many new instances of the builder class by calling `new`, each instance will be
independent of the others.

#### Builders provide default values and throw errors for missing required properties

The builders provide default values for properties whenever possible. The values for these defaults
can be found in IntelliSense descriptions for builder methods. If the library provides a default
value, the method to set that property is labeled as optional in IntelliSense.

Some properties do not have default values, and are labeled as required in IntelliSense. If a
required property is not set, the builder will throw an error when `build` is called.

## Library concepts

### Chart + PrimaryMarks

To create a visualization with Viz Components, a user needs to compose their own chart, created from
a minimum of one `Chart` component and one `PrimaryMarks` component.

Conceptually, a `Chart` component is a shell that handles scaling the visualization, while a
`PrimaryMarks` component draws from a user-provided array of data to set scales and create svg
elements in the DOM.

A very simple HTML implementation of a full chart could look like this

```html
<vic-xy-chart [margin]="margin" [height]="height" [width]="width">
  <svg:g svg-elements vic-primary-marks-bars [config]="primaryMarksConfig"><svg:g>
</vic-xy-chart>
```

The library offers multiple `Chart` components, such as `XyChartComponent` and `MapChartComponent`
as well as multiple `PrimaryMarks` components, such as `BarsComponent`, `LinesComponent`, and
`GeographiesComponent`. Some `PrimaryMarks` components must be used in conjunction with specific
`Chart` components.

A `Chart` component contains a single `<div>` that wraps a single `<svg>`, with content projection
slots before and after the `<div>`, and between the opening and closing tags of the `<svg>`.

The D3 scales used to create the visualization are properties of the `Chart` component, and are used
to scale the svg dynamically with the dimensions of the wrapper `<div>`.

Those scales, however, are set using the data and instructions that the user provides in the
`PrimaryMarks` component's `config` input property. All other Viz Components (or user-developed
components) that a user projects into the content projection slots will have access to these scales
and can use them to create other elements of a data visualization.

There is no limit to what can be projected into the `Chart` component's content-projection slots,
but a `Chart` may have only one `PrimaryMarks` component.

### Data and Styling

At minimum, the user must supply the `PrimaryMarks` component with a `PrimaryMarksConfig` that
provides `data` (any[]), and value accessor functions for each of the components' required
dimensions that tell the component how to find values for each dimension from a `data` array element
-- typically an object with properties. Note that properties that have no relation to the data
visualization may remain on the object without consequence.

The library provides minimal default styles for all components in the library, from `PrimaryMarks`
components to add-on components such as axis components. Users may overwrite these style properties
with their own in each component's `config`.

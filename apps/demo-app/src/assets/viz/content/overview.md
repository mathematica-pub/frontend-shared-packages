# Viz Components

Viz Components is a library of Angular components for building highly custom data visualizations,
built on top of [D3](https://d3js.org/).

Viz Components allows users to compose sub-chart level components into custom data visualizations
and to fully customize the system of visual marks used to represent data. At the same time, this
package takes care of common data viz functionality, such as setting scales, creating axes, and
responsively scaling svgs under the hood.

## Quick Start Guide

The following is a minimal set of steps to take to start creating data visualizations with Viz
Components.

This guide will show you how to create a simple bar chart. Analogous steps can be take for other
chart types.

### System requirements

Viz Components requires the following:

- Node v20
- Angular v18
- AWS cli

### Getting Set up

Viz Components is hosted in a public repository on the [npm registry](https://registry.npmjs.org/).
In order to add it to a project or update it as a dependency, you'll need to follow the steps below.

Install the library with npm

```
npm install @mathstack/viz
```

### Preparing to make your chart

You will need to import a number of modules and services from from `@mathstack/viz` to your Angular
component or application.

For just the bar chart, you will need to do the following.

1. Add modules. These will import required components.

   ```ts
   import { VicChartModule, VicBarsModule } from '@mathstack/viz';
   ...
   @Component ({
     ...
     imports: [
       VicChartModule,
       VicBarsModule,
     ],
   })
   ```

2. Provide a primary marks builder class to create the configuration for the primary marks
   component.

   ```ts
   import { VicBarsBuilder } from '@mathstack/viz';
   ...
   @Component ({
     ...
     providers: [
      VicBarsConfigBuilder
     ]
   })
   ```

### Adding components in a HTML template

The following is the minimum html you will need to create the chart:

```angular-html
<vic-xy-chart>
  <ng-container svg-elements>
    <svg:g vic-primary-marks-bars [config]="barsConfig" />
  </ng-container>
</vic-xy-chart>
```

Note: `svg-elements` is an identifier that needs to be used on a container/element that includes svg
elements that are part of the chart. In this case, because there is only one component with svg
elements, that identifier could also be placed on the `vic-primary-marks-bars` component.

### Creating your chart configuration

You will also need to create the configuration object for your primary marks component (`barsConfig`
in the HTML example above) in your `.ts` file. You will do this using a viz config builder.

#### Injecting a builder

At this point, you should have already added the `VicBarsConfigBuilder` to your component's
`providers` array. Having provided it, we can access it in the component through the constructor (or
`inject` function).

```ts
constructor(private bars: VicBarsConfigBuilder<MyDatum, string>)
```

#### Providing types

You may have noticed that we provide the builder with two types when we inject it. What these types
represent vary from builder to builder.

Here, the first generic is a type that represents one item in the data array that you will use to
make the chart. For the bar chart, the second type is the type of the ordinal value for each bar.

Providing types to the builder to the library will ensure that any callback functions you provide to
the library will have type safety.

#### Using a builder

Builders give users a set of chainable functions that allow for component specification. Functions
can be called in any order, but `getConfig` must be called last.

A minimal use of the bars builder may look like this:

```ts
import { BarsConfig } from '@mathstack/viz';
...
barsConfig: BarsConfig<MetroUnemploymentDatum, string>;
data: MyDatum[];
...
this.barsConfig = this.bars
  .data(this.data)
  .horizontal((bars) =>
    bars
      .x((x) => x.valueAccessor((d) => d.value))
      .y((y) => y.valueAccessor((d) => d.division))
  )
  .color((color) => color.range(['teal']))
  .getConfig();
```

This configuration will create horizontal bars, with one bar per item in `this.data`. Each bar will
represent a `division` value, and all bars will be `teal`.

### Adding additional components/features

#### Chart config

You can provide a configuration object to the `vic-xy-chart` component to set the size, margin, and
resizing properties of the chart. This can be done by importing a `VicChartConfigBuilder`, providing
it in the `providers` array, and using it to create a configuration object.

Reasonable defaults will be used if you do not provide a configuration object.

#### Axes

To make this an actual data visualization, we will need to create some additional context,
particularly in the form of axes. Axes are separate components that you can add to the
`svg-elements` container in your HTML, just like the bars component.

For a horizontal bar chart, you'll want to use a `YOrdinalAxis` component as well as a
`XQuantitativeAxisComponent`.

You'll need to import and provide these modules as well as their respective config builders, just
like you did with `Bars`. Then you can create configuration objects for these components, and
provide them in to their respective components.

#### Everything else

After adding the bars and two axis components with minimal configuration, you likely aren't going to
be satisfied with your visualization. The goal of the team behind this library is to say, "no
problem, we've got you!" and help you quickly get your charts to where they need to be.

We've developed a number of additional features that you can access via the various builders to
provide common viz functionalities. The chart below implements the above instructions, and adds a
few more things. If you look at the code, you'll see that we're wrapping labels on the y axis,
setting a margin on the chart to make space for the wrapped labels, and adding some labels to read
out the values of the bars. You might also notice that the library automatically positioned the
labels based on available space in the chart, and selected a high contrast color for the label when
it is on top of the bar.

This example is only a small taste of what is possible with the library. We encourage you to explore
the rest of the documentation to learn more about the library (including how to make your own
components), and invite you to visit our
[Github issues](https://github.com/mathematica-org/frontend-shared-packages/issues) if any issues
arise while using the library or if you have requests for additional features. Happy Vizzing!

## Example Chart

```custom-angular
main example
```

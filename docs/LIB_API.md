# Library Interface

## Motivations

We aim to provide users with a dependable and intuitive application programming interface.

A dependable interface is one that behaves consistently and correctly, and that has only necessary changes from the user's perspective. An intuitive interface is one that makes as few demands on a user's cognitive load as possible to provide the required functionality.

This is typically achieved through clear names, consistent semantics and behaviors across features, and presenting users with a streamlined mental model of the library that does not expose unnecessary implementation details. (Obviously what constitutes an implementation detail that a user needs to know about is a highly context-specific question.)

In light of that, we work with the following principles:

- Making a chart with the library should be a consistent experience across the different components we offer.
- Our target user is most familiar with the JavaScript eco system, including D3. Things should feel like familiar JavaScript-y ways of doing things.
- The library should provide feedback to the user when they have incorrectly implemented something or failed to implement something. TypeScript is our first line of defense as it prevents incorrect or incomplete implementations.
- It should not be possible for users to manipulate underlying code via the exposed parts of the project. Use TypeScript to control setting and getting of properties as well as calling of methods. Mark things private or protected and/or readonly.

## API Design

We have created viz-components as a set of _composable_ components rather than as discrete charts because we want users to be able to work with the expressiveness afforded by understanding data visualizations as composition of data variable to visual variable mappings. (This is sometimes referred to as a [Grammar of Graphics](https://vita.had.co.nz/papers/layered-grammar) approach, after Leland Wilkinson's 1999 book, _The Grammar of Graphics_.)

Our library code reflects this conception, in some ways intentionally, but also by virtue of attempting to adopt sound coding principles such as the Single Responsibility principles, DRY, etc. We likewise should aim to reinforce this conception of "creating a chart" with how we ask users to undertake that work. When a user provides specifications for their chart, they should understand the experience, fundamentally, as providing a set of instructions per data variable to be visually displayed in the chart.

### Configuring visualizations - user perspective

Each viz-components _component_ that accepts any user input will have one `@Input` property called `config`. Users can generate these configs using builder classes that the library provides to easily and correctly construct configs for the components. The library provides the following builders:

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

The builders provide a set of chainable methods that allow the user to specify the properties of the config. Methods may be called in any order, but the user must call the `build` method at the end of the chain to get the configuration object to pass to the Data Marks component.

Methods on the builder that have the name of a property can be used to set that property though the method's argument. Methods that start with a verb such as `create` or `set` require the user to pass a function that will be called with the property as an argument. Many of these methods allow the user to configure data dimensions, such as a quantitative or ordinal dimension, or for geographies, layers.

_Example_

```ts
this.barsBuilder
  .orientation('horizontal')
  .data(data)
  .createQuantitativeDimension((dimension) => dimension.valueAccessor((d) => d.value))
  .createOrdinalDimension((dimension) => dimension.valueAccessor((d) => d.state))
  .createCategoricalDimension((dimension) => dimension.valueAccessor((d) => d.fruit).range(['red', 'blue']))
  .createLabels((labels) => labels.noValueFunction(() => 'no value'))
  .build();
```

The user can use the builders either through providing the builder the providers array of a component and declaring the it in the component's constructor or by new-ing the class themselves.

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

  constructor(private linesBuilder: VicLinesBuilder) {}

  getConfig(): LinesConfig {
    const config = this.linesBuilder
      ...
      .build();
  }
}
```

_New-ing the class_

```ts
import { VicLinesBuilder } from '@hsi/viz-components';

export class MyAppLinesComponent {

  constructor() {}

  getConfig(): LinesConfig {
    const linesBuilder = new VicLinesBuilder();
    const config = linesBuilder
      ...
      .build();
  }
}
```

Note that builders are stateful classes.

These are the only classes that we refer to as "config". If a config requires nested classes, those classes will use different terms than config and generally should name the thing that they do. (BarLabels, QuantitativeDataDimension, etc.). Classes that govern the transformation from a value to a visual variable are referred to as `dimension`. Maps may also have classes referred to as `layer`s that govern the association of specific geojson geometries with visual attributes and, for one `DataLayer`, attribute data. (These layers in turn have dimension objects on them.)

The library exports a class `Vic` which a user can import into their code and use to generate the requisite config(s). That code may look like the following:

```
Vic.barsHorizontal({
  data: filteredData,
  quantitative: Vic.dimensionQuantitative<MetroUnemploymentDatum>({
    valueAccessor: (d) => d.value,
    valueFormat: (d) => this.getQuantitativeValueFormat(d),
    domainPadding: Vic.domainPaddingPixel(),
  }),
  categorical: Vic.dimensionCategorical<MetroUnemploymentDatum, string>({
    range: ['slategray'],
  }),
  ordinal: Vic.dimensionOrdinal<MetroUnemploymentDatum, string>({
    valueAccessor: (d) => d.division,
  }),
  labels: Vic.barsLabels({
    display: true,
  }),
})
```

The set of properties that a user specifies are referred to throughout the library as `options`. These are a subset of properties in the config, are defined as TS interfaces. Configs or other sub-config objects, such as data dimensions, for which a user can specify `options` should `implement` the `options` type. These properties should be `readonly` on the class.

For a config that is input to a Data Marks component, the user will provide, minimally, an array of data, and then a set of specifications for each data dimension of the visualization, each of which will include a `valueAccessor` function and properties that are specific to the functionality of that dimension. The `valueAccessor` is called on items in the `data` array to extract the value relevant for that dimension.

The library provides default values to be used in the case that the user does not specify a property value whenever possible.

Currently, there is no default value for `QuantitativeDimension.valueAccessor` and `DateDimension.valueAccessor`. If a user does not provide values for those properties, an error will be thrown in the console.

### Configuration classes - architecture perspective

For each

A `config` for a Data Marks component (type `VicDataMarksConfig`), with the various data dimension configs it includes, handles all of the parsing and manipulation of the user's data to create values and methods needed for creating a chart. This parsing and setting of properties occurs on class construction. The Data Marks _components_ should never have to manipulate the user's provided data to get the information it needs to draw its marks.

All `VicDataMarksConfig` classes have a method `initPropertiesFromData`, that should be called as the last action in the class's constructor. This method should call all methods needed to unpack the user supplied data and properties to make the properties required for the component to draw its marks.

Typically, this includes passing the data array down to data dimensions so that properties on those classes can be set from the data. Each class of type `VicDataDimension` has a method, `setPropertiesFromData`, which takes the user input data array, extracts dimension-specific values using its `valueAccessor` to a `values` property, and then sets properties specific to that dimension that will be used to draw marks, such as a domain, a range, a scale, and so forth.

Any functionality that requires values from multiple dimensions -- for example, setting the `valueIndices` used to draw marks, should be located on the `config`. Likewise, data dimensions should never handle functionality related to a particular DataMarks component/that is a property of the DataMarks chart in its totality. For example, although the `barsKeyFunction` on the Bars `config` only requires ordinal values, this should exist on the Bars `config` since it is only needed by the `Bars` component, and dimensions are intended to be used across a variety of Data Marks components. (If multiple Data Marks components needed that functionality, then we would likely move it to the ordinal dimension class.)

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

Our library code reflects this conception, in some ways intentionally, but also by virtue of attempting to adopt sound coding principles such as the Single Responsibility principles, DRY, etc. We likewise should aim to reinforce this conception of "creating a chart" with how we ask users to undertake that work. When a user provides specifications for their chart, they should understand the experience, fundamentally, as providing a set of instructions per data variable to be visually displayed in the chart. We call these sets of instructions a "dimension".

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

#### Builder classes are stateful

Note that builders are stateful classes.

If you create a single instance of the builder class in your component by injecting vis the constructor, set 5 properties, call `build`, and then at a later time set only one additional property, your original 5 properties will be retained. In this case, and in all cases, you will need to called `build` for your changes to be applied.

If you create many new instances of the builder class by calling `new`, each instance will be independent of the others.

#### Builders provide default values and throw errors for missing required properties

The builders provide default values for properties whenever possible. The values for these defaults can be found in IntelliSense descriptions for builder methods. If the library provides a default value, the method to set that property is labeled as optional in IntelliSense.

Some properties do not have default values, and are labeled as required in IntelliSense. If a required property is not set, the builder will throw an error when `build` is called.

### Configuration classes - architecture perspective

The library provides the user with two different types of functionality -- Angular components, and classes that are used to create configuration objects that the user provides to the components.

All exported classes (components and configuration classes) should be prefixed with `Vic` to indicate that they are part of the library.

The code that creates configuration objects should be in a separate directory called `config`. Within that directory, there should be three files: `[component-name].ts`, `[component-name]-options.ts`, and `[component-name]-builder.ts`. For example

```
├── lib
│   ├── my-viz
│   │   ├── config
│   │   │   ├── my-viz-builder.ts // class VicMyVizBuilder
│   │   │   ├── my-viz-options.ts // interface MyVizOptions
│   │   │   ├── my-viz-config.spec.ts // tests for my-viz-config.ts
│   │   │   ├── my-viz-config.ts // class MyVizConfig
│   │   ├── my-viz.component.html // template for my-viz.component
│   │   ├── my-viz.component.scss // styles for my-viz.component
│   │   ├── my-viz.component.spec.ts // tests for my-viz.component
│   │   ├── my-viz.component.ts // @Component() class MyVizComponent
│   │   ├── my-viz.cy.ts // Cypress tests for my-viz component
│   │   ├── my-viz.module.ts // NgModule for my-viz
```

The "config" class (`config/my-viz-config.ts`) is a class that transforms a user's data and configuration specifications into methods and properties that the component can use to draw the visualization.

For all `DataMarks` components, this should _extend_ a base `DataMarksConfig` and possibly and intermediary config like `XYDataMarksConfig`. The config class should _implement_ the corresponding "options" interface. The config class should also expect a required object of the options interface type (`MyVizOptions`). Config classes are expected to always be instantiated via the builder class.

The options interface (`config/my-viz-options.ts`) represents the properties that a user should be able to provide values for. It should not include any properties on the config that a user cannot configure.

We allow the user to provide values for these options in the builder class (`config/my-viz-builder.ts`). Each builder class should have a `build` method that returns a new config class for the component. All properties on the builder class should be `private` or, in the case that we extend the builder class for another component type, for example, with Bars and Stacked Bars, `protected.`

#### Sub-config configuration objects

The builder classes should also allow users to set properties on any sub-config configurations that are necessary for the component, such as dimensions, layers, etc. The methods to set those objects should be named to help the user understand that they cannot directly provide a value as the method's argument, but instead should provide a callback that itself configures the properties. Those methods should new an instance of the builder object for the sub-config configuration object.

The `build` methods on the sub-config objects should be called _by the library_ in the top level builder's build method. _Note: ideally the `build` methods on sub-config builder classes would be private, but right now we don't have a good solution to that. For the time being we prefix them with an underscore for visual distinction._

Note that these sub-config configuration objects are never named or referred to as "config". That term is reserved for the classes that are used to directly create the

#### Setting default values and validation

In addition to facilitating user configuration, the builder class is also responsible for 1. setting default values for properties that can have defaults, and 2. validating the user's configurations.

To set defaults, we create a `DEFAULT` object that contains the default values that is assigned to the builder class in its constructor method.

Validation should be run immediately before the creation of the config class in the `build` method. The validation method should new any sub-configs that it can in the case that a user did not manually configure (for example, if all properties on the sub-config have default values, we should make user configuration of that sub-config optional, and create it ourselves during validation), and should throw errors if required properties have not been set by the user.

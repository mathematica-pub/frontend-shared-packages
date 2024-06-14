# Library Interface

## Motivations

We aim to provide users with a dependable and intuitive application programming interface.

A dependable interface is one that behaves consistently and correctly, and that has only necessary changes from the user's perspective. An intuitive interface is one that makes as few demands on a user's cognitive load as possible to provide the required functionality.

This is typically achieved through clear names, consistent semantics and behaviors across features, and presenting users with a streamlined mental model of the library that does not expose unnecessary implementation details. (Obviously what constitutes an implementation detail that a user needs to know about is a highly context-specific question.)

In light of that, we work with the following principles:

- Making a chart with the library should be a consistent experience across the different components we offer.
- Our target user is most familiar with the JavaScript eco system, including D3. Things should feel like familiar JavaScript-y ways of doing things.
- The library should provide feedback to the user when they have incorrectly implemented something or failed to implement something. TypeScript is our first line of defense as it prevent incorrect or incomplete implementations.
- It should not be possible for users to manipulate underlying code via the exposed parts of the project. Use TypeScript to control setting and getting of properties as well as calling of methods. Mark things private or protected and/or readonly.

## API Design

We have created viz-components as a set of _composable_ components rather than as discrete charts because we want users to be able to work with the expressiveness afforded by understanding data visualizations as composition of data variable to visual variable mappings. (This is sometimes referred to as a [Grammar of Graphics](https://vita.had.co.nz/papers/layered-grammar) approach, after Leland Wilkinson's 1999 book, _The Grammar of Graphics_.)

Our library code reflects this conception, in some ways intentionally, but also by virtue of attempting to adopt sound coding principles such as the Single Responsibility principles, DRY, etc. We likewise should aim to reinforce this conception of "creating a chart" with how we ask users to undertake that work. When a user provides specifications for their chart, they should understand the experience, fundamentally, as providing a set of instructions per data variable to be visually displayed in the chart.

### Configuring visualizations

Each viz-components _component_ that accepts any user input will have one `@Input` property called `config`. These are the only classes that we refer to as "config". If a config requires nested classes, those classes will use different terms than config and generally should name the thing that they do. (BarLabels, QuantitativeDataDimension, etc.)

Users create these configs by using exported functions from the library that will `new` the config.\*

```
Vic.barsHorizontal({
  categorical: Vic.dimensionCategorical({}),
})
```

The set of properties that a user specifies are referred to throughout the library as `options`. These are a subset of properties in the config, are defined as TS interfaces. Configs or other sub-config objects, such as data dimensions, for which a user can specify `options` should `implement` the `options` type. These properties should be `readonly` on the class

For a config that is input to a Data Marks component, the user will provide, minimally, an array of data, and then a set of specifications for each data dimension of the visualization, each of which will include a `valueAccessor` function and properties that are specific to the functionality of that dimension.

The library will provide default values for all feasible

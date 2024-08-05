# Library Interface

## Motivations

We aim to provide users with a dependable and intuitive application programming interface.

A dependable interface is one that behaves consistently and correctly, and that has only necessary
changes from the user's perspective. An intuitive interface is one that makes as few demands on a
user's cognitive load as possible to provide the required functionality.

This is typically achieved through clear names, consistent semantics and behaviors across features,
and presenting users with a streamlined mental model of the library that does not expose unnecessary
implementation details. (Obviously what constitutes an implementation detail that a user needs to
know about is a highly context-specific question.)

In light of that, we work with the following principles:

- Making a chart with the library should be a consistent experience across the different components
  we offer.
- Our target user is most familiar with the JavaScript eco system, including D3. Things should feel
  like familiar JavaScript-y ways of doing things.
- The library should provide feedback to the user when they have incorrectly implemented something
  or failed to implement something. TypeScript is our first line of defense as it prevents incorrect
  or incomplete implementations.
- It should not be possible for users to manipulate underlying code via the exposed parts of the
  project. Use TypeScript to control setting and getting of properties as well as calling of
  methods. Mark things private or protected and/or readonly.

## API Design

We have created viz-components as a set of _composable_ components that a user can arrange to create
data visualizations rather than as discrete charts.

We have chosen this approach for two reasons. First we want users to be able to take advantage of
the expressiveness and variation afforded by understanding data visualizations as set of mappings of
data variables to visual variables. (This is sometimes referred to as a
[Grammar of Graphics](https://vita.had.co.nz/papers/layered-grammar) approach, after Leland
Wilkinson's 1999 book, _The Grammar of Graphics_.) Second, we wanted the experience of building the
visualizations in code to match this expressiveness and flexibility, and thus likewise favor
[composition over inheritance](https://en.wikipedia.org/wiki/Composition_over_inheritance) in our
component architecture to provide a flexible foundation upon which additional or custom features can
easily be added.

We likewise should aim to reinforce this conception of "creating a chart" with how we ask users to
undertake that work. When a user provides specifications for their chart, they should understand the
experience, fundamentally, as providing a set of instructions per data variable to be visually
displayed in the chart. We call these sets of instructions a "dimension".

### Configuration classes - architecture perspective

The library provides the user with two different types of functionality -- Angular components, and
classes that are used to create configuration objects that the user provides to the components.

All exported classes (components and configuration classes) should be prefixed with `Vic` to
indicate that they are part of the library.

The code that creates configuration objects should be in a separate directory called `config`.
Within that directory, there should be three files: `[component-name].ts`,
`[component-name]-options.ts`, and `[component-name]-builder.ts`. For example

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

The "config" class (`config/my-viz-config.ts`) is a class that transforms a user's data and
configuration specifications into methods and properties that the component can use to draw the
visualization.

For all `DataMarks` components, this should _extend_ a base `DataMarksConfig` class and possibly and
intermediary config like `XYDataMarksConfig`. The config class should _implement_ the corresponding
"options" interface. The config class should also expect a required object of the options interface
type (`MyVizOptions`). Config classes are expected to always be instantiated via the builder class.

The options interface (`config/my-viz-options.ts`) represents the properties that a user should be
able to provide values for. It should not include any properties on the config that a user cannot
configure. Options should always be an interface and never a class.

We allow the user to provide values for these options in the builder class
(`config/my-viz-builder.ts` / `MyVizConfigBuilder`). Each builder class that a user interacts with
should have a `getConfig` method that returns a new config class for the component that a user must
call. All properties on the builder class should be `private` or, in the case that we extend the
builder class for another component type, for example, with Bars and Stacked Bars, `protected.`

#### Sub-config configuration objects

The builder classes should also allow users to set properties on any sub-config configurations that
are necessary for the component, such as dimensions, layers, etc. The methods to set those objects
should be named to help the user understand that they cannot directly provide a value as the
method's argument, but instead should provide a callback that itself configures the properties.
Those methods should new an instance of the builder object for the sub-config configuration object.

The methods on the sub-configuration classes that return the sub-configuration object are never
called by the user, and thus are named `_build.` These `_build` methods should instead be called _by
the library_ in the top level builder's build method. _Note: ideally the `_build` methods on
sub-config builder classes would be private, but right now we don't have a good solution to that.
For the time being we prefix them with an underscore for visual distinction._

#### Setting default values and validation

In addition to facilitating user configuration, the builder class is also responsible for 1. setting
default values for properties that can have defaults, and 2. validating the user's configurations.

To set defaults, we create a `DEFAULT` object that contains the default values that is assigned to
the builder class in its constructor method.

Validation should be run immediately before the creation of the config class in the `build` method.
The validation method should new any sub-configs that it can in the case that a user did not
manually configure (for example, if all properties on the sub-config have default values, we should
make user configuration of that sub-config optional, and create it ourselves during validation), and
should throw errors if required properties have not been set by the user.

# TypeScript

Viz Components heavily uses TypeScript. All contributions should be fully typed, avoiding the use of
`any`.

## Semantic Releases

This repo uses the `@jscutlery/semver` package, which automatically bumps the version of a given
package based on conventional commit messages. Ensure you're using
[conventional commit messages](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular)
or the version will not be updated appropriately.

## Generics

Viz Components uses many TS generics to allow the user to specify types specific to their data.

### Naming conventions

Generics should have descriptive names when possible, rather than `T` or `T, U`.

If a generic is used for a type that is fully configurable by the user and does not need to adhere
to any other type signature, the name for that generic should describe the purpose of the entity
that is being typed.

Do:

```ts
class MyConfig<Datum> {
  data: Datum[];
}
```

Avoid:

```ts
class MyConfig<T> {
  data: T[];
}
```

If a generic, to be specified by the user, is used for a type that needs to conform to a particular
type signature and therefore extends a base type, that generic should also have a descriptive name
in the form of `TBaseType`. It is permissable to shorten the name of the base type in the generic
name for the sake of brevity provided it is descriptive and distinct.

Do:

```ts
class MyConfig<TGeometry extends MySpecialJsonGeometry> {
  geometries: TGeometry[];
}
```

Avoid:

```ts
class MyConfig<G extends MySpecialJsonGeometry> {
  geometries: G[];
}
```

#### User-exposed method names in builder classes

The names of the various methods in the builder classes are exposed to users and constitute the
library's programming interface. Extra care should be taken to make sure those names are descriptive
and precise.

The names of these methods should help the user understand what they can expect to _see_ from
whatever they provide to the method. For example, a dimension that uses categorical values to set
the color of the marks should be called `color` rather than `categoricalData`.

For naming color setting methods in particular, if we anticipate the user setting both the stroke
and fill of the SVG elements, we should use the term `fill`. Otherwise, if the user will only set
the fill color of the elements, we should use the term `color`. For example, geographies, which we
expect to have a visible stroke, should use `fill`, where as bars should use `color`.

### Interface/Class Properties

Properties on interfaces and classes should be in alphabetical order (among analogous properties)
unless there is a good reason not to.

Properties with Angular decorators, such as `@Input`, `@ViewChild`, etc, should be grouped together
and alphabetized within the group.

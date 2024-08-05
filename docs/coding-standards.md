# TypeScript

Viz Components heavily uses TypeScript. All contributions should be fully typed, avoiding the use of `any`.

## Generics

Viz Components uses many TS generics to allow the user to specify types specific to their data.

### Naming conventions

Generics should have descriptive names when possible, rather than `T` or `T, U`.

If a generic is used for a type that is fully configurable by the user and does not need to adhere to any other type signature, the name for that generic should describe the purpose of the entity that is being typed.

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

If a generic, to be specified by the user, is used for a type that needs to conform to a particular type signature and therefore extends a base type, that generic should also have a descriptive name in the form of `TBaseType`. It is permissable to shorten the name of the base type in the generic name for the sake of brevity provided it is descriptive and distinct.

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

# Domumenting Viz Components

## Documenting builder methods in builder classes

We use JSDoc comments to create documentation that is shown to the user in VSCode. Note that the
TypeScript complier only supports a certain set of JSDoc tags, which is (documented
here)[https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html].

### Comment guidelines

We should try to provide a consistent user experience of Builder class documentation. The following
is a set of guidelines.

- Start a comment block by indicating if the method is required or optional. If the method is
  required, start the description with 'REQUIRED'. If the method is optional, start the description
  with 'OPTIONAL'.

- Then provide a high level description of the method. This should be a single sentence that
  describes what the method does. If the method takes a callback that allows the user to specify
  additional properties, use the term 'specifies.' If the method takes a variable that is not a
  callback and sets the value of a property, use the term 'determines.'

- Follow this by using the JSDoc @param tag to describe the parameters of the method. The
  description should be a single sentence that describes what the parameter does.

- Add additional information about the method, including defaults in lines below the param
  description.

### Examples

```typescript
  /**
   * OPTIONAL. Specifies the configuration of grid lines for the axis. Grid lines are the lines that run perpendicular to the axis and intersect with tick marks.
   *
   * @param grid - A callback that specifies properties for the grid lines, or `null` to unset the grid.
   *
   * If called with no argument, the default values of the grid will be used.
   */
  grid(grid: (grid: GridBuilder) => void): this;
  grid(): this;
  grid(grid: null): this;
  grid(grid?: ((grid: GridBuilder) => void) | null): this {
    if (grid === null) {
      this.gridBuilder = undefined;
      return this;
    }
    this.gridBuilder = new GridBuilder();
    grid?.(this.gridBuilder);
    return this;
  }
```

```typescript
  /**
   * OPTIONAL. Determines whether tick labels (`SVGTextElement`s) will be removed from the axis.
   *
   * @param value - `true` to remove all tick labels, `false` to retain all tick labels.
   *
   * If called with no argument, the default value is `true`.
   *
   * If not called, the default value is `false`.
   */
  removeTickLabels(value: boolean = true): this {
    this._removeTickLabels = value;
    return this;
  }
```

### Overloads

If a method has multiple overloads, the overload that we expect the user to use more frequently
should be first, so that it is shown in the tooltip.

Users can see all overloads by typing `(` after the method name.

## Documenting builder methods in custom .md files

The documentation for builder methods should match the JSDoc comments in builder classes to the
greatest extent possible.

Builder method documentation needs to follow the following format:

```builder-method
name: <method-name>
description: <method-description>
params:
  - name: <param-name>
    type: <param-type>
    description: <param-description>
  - name: <param-name>
    type: <param-type>
    description: <param-description>
```

Param descriptions may also be formatted as a list, but be warned that the parser is finicky about
this and you may need to wrap the description lines in quotation marks to get it to parse correctly.

```builder-method
name: <method-name>
description: <method-description>
params:
  - name: <param-name>
    type: <param-type>
    description:
      - <param-description>
      - <param-description>
```

# VizComponents

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version
14.0.0.

## Code scaffolding

Run `ng generate component component-name --project viz-components` to generate a new component. You
can also use
`ng generate directive|pipe|service|class|guard|interface|enum|module --project viz-components`.

> Note: Don't forget to add `--project viz-components` or else it will be added to the default
> project in your `angular.json` file.

## Build

Run `./build.sh` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

## Using the library

1.  run `npm install @mathstack/viz`.

## Extending a component

After installing the library, run `ng g viz-components:extend` and follow the instructions from
there.

If you need to extend a component and then also extend an event directive, see the code snippet
below:

```
export class MyProjectLinesComponent extends LinesComponent {
  myLines = true;
}

@Directive()
export class MyProjectLinesHoverMoveDirective extends LinesHoverMoveDirective<MyProjectLinesComponent> {
  @Input('vicLinesHoverMoveActions')
  override actions: HoverMoveAction<
    LinesHoverMoveDirective<MyProjectLinesComponent>
  >[];

  constructor(@Inject(LINES) public override lines: MyProjectLinesComponent) {
    super(lines);
  }
}
```

## Running unit tests

Run `ng test viz-components` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the
[Angular CLI Overview and Command Reference](https://angular.io/cli) page.

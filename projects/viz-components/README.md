# VizComponents

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.0.0.

## Code scaffolding

Run `ng generate component component-name --project viz-components` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project viz-components`.

> Note: Don't forget to add `--project viz-components` or else it will be added to the default project in your `angular.json` file.

## Build

Run `./build.sh` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

1. run `npm run prepare` from the viz-components folder

2. in the root folder, run ./build.sh

3. Go to the dist folder `cd dist/viz-components` and run `npm publish`.

## Using the library

1.  add the below to the "scripts" section of the package.json

        "preinstall": "npm run codeartifact:login",
        "codeartifact:login": "aws codeartifact login --tool npm --repository vizcolib --domain frontend"

2.  run `npm install @web-ast/viz-components`. If it can't be found, it's probably because the preinstall script didn't actually run (it's supposed to but doesn't always, at least not for me, and haven't successfully debugged yet). Manually run the preinstall script, `npm run preinstall`, then run `npm install @web-ast/viz-components` again.

## Extending a component

After installing the library, run `ng g viz-components:extend` and follow the instructions from there.

If you need to extend a component and then also extend an interactivity directive, see the code snippet below: 

```
export class MyProjectLinesComponent extends LinesComponent {
  myLines = true;
}

@Directive()
export class MyProjectLinesHoverMoveDirective extends LinesHoverMoveDirective<MyProjectLinesComponent> {
  @Input('vicLinesHoverMoveEffects')
  override effects: HoverMoveEventEffect<
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

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

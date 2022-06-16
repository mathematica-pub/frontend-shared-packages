# VizComponents

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.0.0.

## Code scaffolding

Run `ng generate component component-name --project viz-components` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project viz-components`.

> Note: Don't forget to add `--project viz-components` or else it will be added to the default project in your `angular.json` file.

## Build

Run `./build.sh` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

1. run `verdaccio` from the main folder `viz-components` (not in `projects/viz-components`)

2. In the same folder run `./build.sh`

3. Go to the dist folder `cd dist/viz-components` and run `npm publish`.

The `package.json` for this project has set the npm registry as being `localhost:4873` -- this is currently verdaccio, once we get AWS hosting support set up, we'll port over to that (I think the commands will remain the same).

To test if custom schematics worked, create a blank angular project (anywhere; I haven't set up the demo app to do this). Either just run `npm install viz-components --registry=http://localhost:4873` or create an .npmrc file (in the top-level folder) and add `registry="http://localhost:4873"` to it.

Finally, run `ng g viz-components:extend` and follow the instructions from there.

## Running unit tests

Run `ng test viz-components` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

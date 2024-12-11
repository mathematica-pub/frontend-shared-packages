# Automated documentation

We use Compodoc to automatically generate .html files that can be used to make documentation of the
library visible in a hosted site. Compodoc generates one file per symbol in the repo. These files
are located in `compodoc/docs`.

We then run a TypeScript script (`compodoc/processing/documentation-processor.ts`) to extract the
.html files that we want from what Compodoc has generated, and assemble those files into a tree
structure that we display in the Demo App sidebar.

The `documentation-structure.yaml` file (in `apps/demo-app/assets/documentation/[lib]`) determines
which of the Compodoc-generated html files we make viewable in the `DOCUMENTATION` section of the
demo app, and how they are titled and organized.

There are no technical constraints to the names of keys in this file or their hierarchical
organization. However, the string values of the keys -- for example --
'classes/VicImageDownloadConfig.html' refers to the file within the `compodoc/docs` directory at the
top level of the project. This string must match the path name exactly or a build error will be
thrown.

## Modifying the documentation structure

`documentation-structure.yaml` will need to be updated in the following cases:

1. You want to add a new documentaton file to the Demo App. **Action:** Add a new key and value.
2. You deleted a symbol that had documentation in the library. **Action:** Delete the key and value.
3. The name of the type/interface/class/etc that is in the current documentation structure changed
   in the library. For example, if documentation for `class MyVizConfig` was already in the
   documentation, and you modify the name of the class in the library to `class MyAwesomeVizConfig`,
   you will need to manually update the name of the .html file in the appropriate documentation
   structure value. **Action:** Edit value to reflect new name.
4. You changed the type of the symbol that we already have documentation for in the documentation
   structure. For example, if `class MyVizConfig` became `interface MyVizConfig`, or if it became an
   Angular directive through the application of `@Directive()`. When Compodoc generates
   documentation, it places files into the directories listed below.

   - additional-documentation
   - classes
   - components
   - directives
   - fonts
   - images
   - injectables
   - interfaces
   - js
   - miscellaneous
   - modules
   - pipes
   - styles

   **Action:** Edit value to reflect new path to file.

## Regenerating documentation

To generate Compodoc docs, and parse/move files all in one command, you can run
`npm run build:docs:ui-components` or `npm run build:docs:viz-components`.

Alternately, in some scenarios, you may want to run Compodoc and then parse/move the docs
separately. In this case you can run `npm run compodoc:build:ui-components` or
`npm run compodoc:build:viz-components` first and then `npm run process-docs:ui-components` or
`npm run process-docs:viz-components`.

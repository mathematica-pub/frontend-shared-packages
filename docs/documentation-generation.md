# Automated documentation

We use Compodoc to automatically generate .html files that can be used to make documentation of the
library visible in a hosted site. Compodoc generates one file per symbol in the repo. These files
are located in `documentation.`

We then use a custom python script to extract the .html files that we want from what Compodoc has
generated, and assemble those files into a tree structure that we display in the Demo App navbar.

The `documentation-structure.yml` file (in `projects/demo-app/assets/documentation`) governs which
of the Compodoc-generated html files we make viewable, and how they are organized.

The structure of this file/the keys are entirely arbitrary/can be designed to best organize the
information. The string values of the keys -- for example -- 'classes/VicImageDownloadConfig.html'
refers to the file within the `documentation` directory at the top level of the project. This string
must match the path name exactly or a build error will be thrown.

## Modifying the documentation structure

`documentation-structure.yml` will need to be updated in the following cases:

1. You want to add a new documentaton file to the Demo App. Add a new key and value.
2. You deleted a symbol that had documentation in the library. Delete the key and value.
3. The name of the type/interface/class/etc that is in the current documentation structure changed
   in the library. For example, if documentation for `class MyVizConfig` was already in the
   documentation, and you modify the name of the class in the library to `class MyAwesomeVizConfig`,
   you will need to manually update the name of the .html file in the appropriate documentation
   structure value.
4. You changed the type of the symbol that we already have documentation for in the documentation
   structure. For example, if `class MyVizConfig` became `interface MyVizConfig`, or if it became an
   Angular directive through the application of `@Directive()`. When Compodoc generates
   documentation, it places files into the following directories:
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
   - styles Update the path in the appropriate documentation structure value.

## Regenerating documentation

1. Remove the existing Compodoc generated documentation in your local branch by running:
   `rm -rf documentation`
2. Build documentation from the current library code with Compodoc by running:
   `npm run compodoc:build`
3. Ensure that `documentation-structure.yml` is up to date.
4. Parse the newly generated Compodoc documentation in to documentation assets for the Demo App by
   running: `pipenv run python projects/demo-app/documentation-generator/documentation-parser.py`

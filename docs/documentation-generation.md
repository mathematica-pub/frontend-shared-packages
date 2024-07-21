## Adding new components

1. add to `documentation-structure.yaml` file in `assets/documentation`
2. regenerate documentation, see below

## Regenerating documentation

To regenerate documentation when adding new components or otherwise updating the documentation, do the following:

1. Remove any documentation in your local branch: `rm -rf documentation`
2. Build docs from code with Compodoc `npm run compodoc:build`
3. Structure the HTML for docs in demo site `pipenv run python projects/demo-app/documentation-generator/documentation-parser.py`

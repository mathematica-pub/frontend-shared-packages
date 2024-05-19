# Adding new components

1. add to `documentation-structure.yaml` file in `assets/documentation`
2. regenerate documentation, see below

# Regenerating documentation

Run this when either a) adding new components / modifying component code or b) updating documentation to include any revised comments

1. `rm -rf documentation`
2. `npm run compodoc:build`
3. `pipenv run python projects/demo-app/documentation-generator/documentation-parser.py`

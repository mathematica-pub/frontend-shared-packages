# Adding new components

1. add to `documentation-structure.yaml` file in `assets/documentation`
2. regenerate documentation, see below

# Regenerating documentation

Run this when either a) adding new components / modifying component code or b) updating documentation to include any revised comments

1. `npm run compodoc:build`
2. `python documentation-parser.py` (run from this file's directory)

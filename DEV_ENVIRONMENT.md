# Developer guide: Running and accessing the application

## Requirements

This project has the following requirements for the developer's/virtual machine:

- `node` version 18 or higher
- `npm` for package management on a developer's machine
- optional: python, pipenv for compodoc documentation generation

## Locally generating compodoc documentation

If you don't have python/pyenv/pipenv installed, see [this guide](https://mathematicampr.atlassian.net/wiki/spaces/DSEH/pages/513476508/How+to+Install+and+Set+Up+Python).

If you've already got everything installed, it's usually a good practice to update pip and pipenv with

```
python -m pip install --upgrade pip
pip install --upgrade pipenv
```

Then run `pipenv install --dev` to install the dependencies.

To generate documentation, run `npm run build:documentation`.

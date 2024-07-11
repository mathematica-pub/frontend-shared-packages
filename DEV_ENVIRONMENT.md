# Developer guide: Running and accessing the application

## Requirements

This project has the following requirements for the developer's/virtual machine:

- `node` version 18 or higher
- `npm` for package management on a developer's machine
- optional: python, pipenv for compodoc documentation generation

## Beta-releases

Viz-components supports beta-releases so that we can test library code on real projects before officially making a feature stable and merging to main. This lets us make sure we can have rigorous tests and decent documentation for new features without slowing down project work too much.

On any open PR add a comment that says `beta-release-bot: my-awesome-release` and a beta-release job will be deployed. If the current package version in `projects/viz-components/package.json` is `1.0.6`, the beta-released version will be `1.0.6-my-awesome-release`. To redeploy, add another comment with a new release name (e.g. `beta-release-bot: my-awesome-release-trying-this-again`).

## Locally generating compodoc documentation

If you don't have python/pyenv/pipenv installed, see [this guide](https://mathematicampr.atlassian.net/wiki/spaces/DSEH/pages/513476508/How+to+Install+and+Set+Up+Python).

If you've already got everything installed, it's usually a good practice to update pip and pipenv with

```
python -m pip install --upgrade pip
pip install --upgrade pipenv
```

Then run `pipenv install --dev` to install the dependencies.

To generate documentation, run `npm run build:documentation`.

## Adding dependencies to the library

If you are going to add dependencies to the library (an external package such as D3), you should manually add the package and appropriate version to `projects/viz-components/package.json` as a **peer dependency**.

**Do not install via the command line with npm install** as that will build node_modules inside viz components which will cause version conflicts.

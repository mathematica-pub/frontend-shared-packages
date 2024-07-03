# Developer guide: Running and accessing the application

## Requirements

This project has the following requirements for the developer's/virtual machine:

- `node` version 18 or higher
- `npm` for package management on a developer's machine
- optional: python, pipenv for compodoc documentation generation

## Beta-releases

Viz-components supports beta-releases so that we can test library code on real projects before officially making a feature stable and merging to main. This lets us make sure we can have rigorous tests and decent documentation for new features without slowing down project work too much.

Developers can update `viz-components/package.json` to have a version suffixed with `-beta`, then push to any branch entitled `beta-release-[branch-description-here]`, and our beta-release deployment script will run. If developers want to update the beta-released package, simply bump the package version number and push to the beta-release branch you created again.

Before a beta-release feature is merged to main, rename your branch (so there's no `beta-release` in it), remove `-beta` from the package version name, and bump the official version of the package.

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

# Developer guide: Running and accessing the application

## Requirements

This project has the following requirements for the developer's/virtual machine:

- `node` version 18 or higher
- `npm` for package management on a developer's machine
- optional: python, pipenv for compodoc documentation generation

## Setup

To install necessary dependencies and automatic commit linting for development, run
`npm run setup-repo`.

## Beta-releases

Frontend shared packages support beta-releases so that we can test library code on real projects
before officially making a feature stable and merging to main. This lets us make sure we can have
rigorous tests and decent documentation for new features without slowing down project work too much.
The beta release process is as follows:

1. Open a PR that has at least one commit prefixed with `fix:`, `feat:`, or `perf:` or that has a
   `BREAKING CHANGE:` footer. This way our automated versioning system can detect that your changes
   warrant a version bump.
2. Leave a comment on the PR that says `beta-release-bot: <package name>` (e.g.
   `beta-release-bot: viz-components`). This should kick off a beta release job.
   > NOTE: the comment cannot be part of a PR review
3. An automated comment should be left on your PR. This will either indicate success and provide
   instructions for how to install your beta release or notify you of a workflow failure.

> NOTE: Once you've beta released once from a particular PR, you don't need to add additional
> `fix:`, `feat:`, `perf:` or `BREAKING CHANGE:` commits if you want to beta release again. The
> system should automatically increment the beta release version for you and provide you with the
> version number. E.g. you can release `@hsi/viz-components@1.0.1-beta.0` and then comment again
> immediately to release `@hsi/viz-components@1.0.1-beta.1`.

## Running applications (e.g. demo-app, my-work) with deployed libraries

To run all apps with the lastest version of all `libs` deployed to codeartifact, set your aws
credentials, then run:

`bash toggle-hsi.sh --npm`

To revert to refer to local files (as we typically want when doing library development), run:

`bash toggle-hsi.sh --local`

The `toggle-hsi.sh` script toggles all internal `@hsi` libraries back and forth from pointing at
`dist` (locally compiled files) to pointing at `node_modules/@hsi`. It does this by updating the
root level `package.json` and `tsconfig.json`, then resetting the `nx` daemon to clear workspace
dependency caches.

## Locally generating compodoc documentation

If you don't have python/pyenv/pipenv installed, see
[this guide](https://mathematicampr.atlassian.net/wiki/spaces/DSEH/pages/513476508/How+to+Install+and+Set+Up+Python).

If you've already got everything installed, it's usually a good practice to update pip and pipenv
with

```
python -m pip install --upgrade pip
pip install --upgrade pipenv
```

Then run `pipenv install --dev` to install the dependencies.

To generate documentation, run `npm run build:documentation`.

## Adding dependencies to the library

If you are going to add dependencies to the library (an external package such as D3), you should
manually add the package and appropriate version to `libs/viz-components/package.json` as a **peer
dependency**.

**Do not install via the command line with npm install** as that will build node_modules inside viz
components which will cause version conflicts.

# Developer guide: Running and accessing the application

## Requirements

This project has the following requirements for the developer's/virtual machine:

- `node` version 18 or higher
- `npm` for package management on a developer's machine
- optional: python, pipenv for compodoc documentation generation

## Beta-releases

Viz-components supports beta-releases so that we can test library code on real projects before
officially making a feature stable and merging to main. This lets us make sure we can have rigorous
tests and decent documentation for new features without slowing down project work too much.

To create a beta release, you will push code to a remote `beta` branch in the
`frontend-shared-packages` repo. This will trigger a workflow that will publish a beta release to
the `@hsi` npm organization.

Follow the following steps to create a beta release:

1. Develop and test the changes that you would like to release on a local branch, e.g.
   `my-new-changes`. To ensure our automated releasing system (handled by the `semantic-release`
   library) detects that a version bump is needed, confirm that you have at least one commit message
   that

   - Touches code in the package you want to release AND
   - Is prefixed with `fix:` or `feat:` or has a footer prefixed with `BREAKING CHANGE:`

(See: [formatting guidelines](https://gist.github.com/develar/273e2eb938792cf5f86451fbac2bcd51) on
Conventional Commits)

2. When you are ready to release, confirm
   [here](https://github.com/mathematica-org/frontend-shared-packages/branches) that there is not
   already a remote `beta` branch in the `frontend-shared-packages`. If it already exists, complete
   the following steps using `alpha` instead.

   > There can only be one alpha or beta branch, but ideally they're short-lived. We're essentially
   > using them as throwaway branches that are purely for triggering the beta release workflow.

   > This is because `semantic-release` automatically appends the branch name to the end of
   > prerelease packages, so any branch that has numbers in it or has a long name will fail to
   > deploy.

3. Create a local `beta` branch from your development brand, and then push to a remote `beta` branch

```bash
// Branch off your development branch
git checkout -b beta

// Push to beta branch
git push --set-upstream origin beta
```

4. You should see a new
   [workflow](https://github.com/mathematica-org/frontend-shared-packages/actions/workflows/publish-package.yml)
   kicked off. Once that's complete, your beta release should show up
   [here](https://github.com/mathematica-org/frontend-shared-packages/releases).
5. Install the beta release into your project using
   `npm install @hsi/<PACKAGE>@<BETA RELEASE VERSION>` (e.g. `@hsi/viz-components@3.0.1-beta.1`).
6. **IMPORTANT:** Once you've successfully installed your beta release, delete the remote beta
   branch from the `frontend-shared-packages` repo!

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
manually add the package and appropriate version to `projects/viz-components/package.json` as a
**peer dependency**.

**Do not install via the command line with npm install** as that will build node_modules inside viz
components which will cause version conflicts.

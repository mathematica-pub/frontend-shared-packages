# Frontend Shared Packages

This is a repo/Angular workspace that houses HSI's Angular libraries and associated applications.

Currently, the workspace consists of three libraries: `app-kit`, `ui`, and `viz`, and an app that
serves as our documentation site, `demo-app`. These libraries are currently in maintenance mode, and
the package maintainers are not actively adding new features. The libraries will continue to be
updated so that they can be used with the latest version of Angular. If you would like to make a
change, please see the [contribution guidelines](#Contributing)

The packages can be downloaded from the npm registry here:

- viz: https://www.npmjs.com/package/@mathstack/viz
- old-viz (not maintained; code can be viewed): https://www.npmjs.com/package/@mathstack/old-viz
- ui: https://www.npmjs.com/package/@mathstack/ui
- app-kit: https://www.npmjs.com/package/@mathstack/app-kit

## VizComponents

[![build, lint, & test](https://github.com/mathematica-org/viz/actions/workflows/unit-testing-linting.yml/badge.svg)](https://github.com/mathematica-org/viz/actions/workflows/unit-testing-linting.yml)

VizComponents is a library of Angular components built on top of D3 that can be composed by a user
to create custom visualizations.

VizComponents takes care of common data viz functionality under the hood, such as setting scales,
creating axes, and responsively scaling svgs. At the same time Viz Components allows the user to
fully customize the system of visual marks used to represent data.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version
14.0.0.

## How to use libraries

Libraries are published to the npm registry.

1.  `npm i @mathstack/viz` or `npm i @mathstack/ui`
2.  Once the package is installed, you can use it like any normal third party package

## Example Projects

- [Covid Cohort](https://github.com/mathematica-org/covid-cohort)
- [Scorecard](https://github.com/mathematica-org/MACScorecard-Frontend) Uses viz bars, lines, and
  geographies. Uses image and data download services. Examples of custom/extended bars, lines, and
  geographies components. Geography is US map, and has small state squares w/hover & click actions.
  Also uses ui dropdown, tabs, and table.

## Feedback, Bugs, and Issues

Please submit any feedback, bugs, or issues to the repository's issue tracker. This keeps everything
in one location, rather than having Jira tickets scattered across different projects. You're welcome
to create jira tickets in external projects to track as well, but there should be a Github Issue to
track any work that needs to be done in this repository.

See the Contributing section for more information.

## Maintainers

Maintainers of this package can help integrate this shared package into a project, triage bugs, and
review pull requests. To become a maintainer, you need to have contributed at least five pull
requests to the shared package and demonstrate an overall understanding of the architecture used.
(We want more maintainers!)

Maintainers are jointly responsible for reviewing issue requests and PRs in a timely manner.

Our current maintainers are:

- Claire McShane
- Tom Coile

## Contributing

We appreciate community contributions to frontend-shared-packages. Here are some ways you can
contribute.

If you would like a new feature added, feel free to fork the repository and make a pull request,
then tag a maintainer. You are also welcome to fork this repository to use as you wish.

### Creating an issue

Anyone who has access to the repo may
[open an issue](https://github.com/mathematica-pub/frontend-shared-packages/issues) to track a bug,
request documentation, or suggest a feature.

I you are internal to Mathematica, after creating a GitHub issue, drop a link to it in our
[Slack channel](https://astwebcloud.slack.com/archives/C06865ECFFE).

If you don't have access to the internal Slack, please tag a [Maintainer](#maintainers).

### Issue approval

After any issue is created, it will receive the label "awaiting approval."

Before development work begins, three people aside from the person who opened the issue need to
leave a comment on the issue granting approval. Two of these people need to be maintainers.

Potential approvers should ask clarifying questions in the issue comments if necessary before
approving. Approving entails agreement that the feature, as detailed in the issue, is a good fit for
the package.

### Code design.

During the approval process, any approver/maintainer can tag the issue with the label "needs code
design document".

This entails scoping out what code will be changed, and how. Code design documentation should
describe any functions' or configs' input/output changes, planned testing, etc. If necessary, a
draft PR can be opened to describe changes; otherwise, GitHub comments on the issue will suffice.

All approvers of the issue must sign off on the code design document before the issue moves to
development.

### Development.

Any issue that is marked as "ready for development" can be self-assigned by any person with write
access or a maintainer. If you do not have write access to the repository, you may comment on the
issue and tag a Maintainer, who may assign you the issue. Once assigned, we want ongoing development
progress to be made in the form of commits pushed to a draft PR or comments written to the issue or
draft PR. If you don't have time to make weekly progress on an issue, we ask that you push all your
progress to the repo (in the form of a draft PR or issue comments) and unassign yourself from the
issue. (Unassignment will be automated eventually.)

You are welcome to work on an issue and make a PR even if you have not yet been assigned the issue!

### Making a PR

1. Fork the (frontend-shared-packages
   repo)[https://github.com/mathematica-pub/frontend-shared-packages/]
2. Ensure you have read the README.md of the package you are updating
3. In your forked repository, make your changes in a new git branch:

```
git checkout -b my-fix-branch main
```

4. Make code updates, updating or writing new tests as necessary
5. Manually test that your updates solve the issue. Ensure the code builds and passes linting and
   testing.
6. Commit using semantic commits.
7. In make a pull request to `mathematica-pub/frontend-shared-packages:main`.

### Code review

Once you are ready for review, change your draft PR to a normal PR, and ask for reviews in
[hsi-viz' Slack channel](https://astwebcloud.slack.com/archives/C06865ECFFE). If you do not have
slack access, please tag a maintainer.

Two people (at least one maintainer) need to review the PR for it to be merged.

## Development Best Practices

TODO: add some info about best practices

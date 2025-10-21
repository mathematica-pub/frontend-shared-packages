# Frontend Shared Packages

This is a repo/Angular workspace that houses HSI's Angular libraries and associated applications.

Currently, the workspace consists of two libraries: `ui` and `viz`, and an app that serves as our
documentation site, `demo-app`.

## VizComponents

[![build, lint, & test](https://github.com/mathematica-org/viz/actions/workflows/unit-testing-linting.yml/badge.svg)](https://github.com/mathematica-org/viz/actions/workflows/unit-testing-linting.yml)
[![Publish to CodeArtifact](https://github.com/mathematica-org/viz/actions/workflows/deploy-codeartifact-cloudfront.yml/badge.svg)](https://github.com/mathematica-org/viz/actions/workflows/deploy-codeartifact-cloudfront.yml)

VizComponents is a library of Angular components built on top of D3 that can be composed by a user
to create custom visualizations.

VizComponents takes care of common data viz functionality under the hood, such as setting scales,
creating axes, and responsively scaling svgs. At the same time Viz Components allows the user to
fully customize the system of visual marks used to represent data.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version
14.0.0.

## How to use libraries

1.  set your aws credentials (found in `~/.aws/credentials`)
2.  `aws codeartifact login --tool npm --domain shared-package-domain --repository shared-package-repository --domain-owner 922539530544 --namespace @mathstack`
3.  `npm i @mathstack/viz` or `npm i @mathstack/ui`
4.  Once the package is installed, you can use it like any normal third party package

## Example Projects

- [Covid Cohort](https://github.com/mathematica-org/covid-cohort)
- [Scorecard](https://github.com/mathematica-org/MACScorecard-Frontend) Uses viz-components bars,
  lines, and geographies. Uses image and data download services. Examples of custom/extended bars,
  lines, and geographies components. Geography is US map, and has small state squares w/hover &
  click actions. Also uses ui dropdown, tabs, and table.

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

- Stephanie Tuerk
- Claire McShane
- Tom Coile

[See more on the role of maintainers here.](https://mathematicampr.atlassian.net/wiki/spaces/WEB/pages/2519892380/Shared+Package+Maintenance+and+Development)

## Contributing

1. Creating an issue

Anyone who has access to the repo may
[open an issue](https://github.com/mathematica-org/viz-components/issues) to track a bug, request
documentation, or suggest a feature.

After creating a GitHub issue, drop a link to it in our
[Slack channel](https://astwebcloud.slack.com/archives/C06865ECFFE).

Eventually, we'll probably have some automated alerts sent directly to the Slack channel, but for
now, see
[this Confluence document](https://mathematicampr.atlassian.net/wiki/spaces/WEB/pages/2593784468/Integrating+Github+and+Slack)
for info on how to get Slack alerts for updates to issues and PRs.

2. Issue approval

After any issue is created, it will receive the label "awaiting approval."

Before development work begins, three people aside from the person who opened the issue need to
leave a comment on the issue granting approval. Two of these people need to be maintainers.

Potential approvers should ask clarifying questions in the issue comments if necessary before
approving. Approving entails agreement that the feature, as detailed in the issue, is a good fit for
the package.

3. Code design.

During the approval process, any approver/maintainer can tag the issue with the label "needs code
design document".

This entails scoping out what code will be changed, and how. Code design documentation should
describe any functions' or configs' input/output changes, planned testing, etc. If necessary, a
draft PR can be opened to describe changes; otherwise, GitHub comments on the issue will suffice.

All approvers of the issue must sign off on the code design document before the issue moves to
development.

3. Development.

Any issue that is marked as "ready for development" can be self-assigned by any contributor or
maintainer. Once assigned, we want ongoing development progress to be made in the form of commits
pushed to a draft PR or comments written to the issue or draft PR. If you don't have time to make
weekly progress on an issue, we ask that you push all your progress to the repo (in the form of a
draft PR or issue comments) and unassign yourself from the issue.

(Unassignment will be automated eventually.)

4. Code review

Once you are ready for review, change your draft PR to a normal PR, and ask for reviews in
[hsi-viz-components' Slack channel](https://astwebcloud.slack.com/archives/C06865ECFFE).

Two people (at least one maintainer) need to review the PR for it to be merged.

## Development Best Practices

TODO: add some info about best practices

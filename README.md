# VizComponents

VizComponents is a library of Angular components built on top of D3 that can be composed by a user to create custom visualizations.

VizComponents takes care of common data viz functionality under the hood, such as setting scales, creating axes, and responsively scaling svgs. At the same time Viz Components allows the user to fully customize the system of visual marks used to represent data.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.0.0.

## How to use

1.  set your aws credentials (found in `~/.aws/credentials`)
2.  `aws codeartifact login --tool npm --domain shared-package-domain --repository shared-package-repository --domain-owner 922539530544 --namespace @hsi`
3. `npm i @hsi/[PACKAGE_NAME_HERE]`
4. Once the package is installed, you can use it like any normal third party package

## Example Projects

- [Covid Cohort](https://github.com/mathematica-org/covid-cohort)
- [Scorecard](https://github.com/mathematica-org/MACScorecard-Frontend)
Uses VizComponents bars, lines, and geographies. Uses image and data download services. Examples of custom/extended bars, lines, and geographies components. Geography is US map, and has small state squares w/hover & click effects. 

## Feedback, Bugs, and Issues

Please submit any feedback, bugs, or issues to the repository's issue tracker. This keeps everything in one location, rather than having Jira tickets scattered across different projects.  You're welcome to create jira tickets in external projects to track as well, but there should be a Github Issue to track any work that needs to be done in this repository.

See the Contributing section for more information.

## Maintainers

Maintainers of this package can help integrate this shared package into a project, triage bugs, and review pull requests. To become a maintainer, you need to have contributed at least five pull requests to the shared package and demonstrate an overall understanding of the architecture used. (We want more maintainers!) 

Maintainers are jointly responsible for reviewing issue requests and PRs in a timely manner.

Our current maintainers are: 

- Stephanie Tuerk
- Ellie Irish
- Claire McShane
- Tom Coile

[See more on the role of maintainers here.](https://mathematicampr.atlassian.net/wiki/spaces/WEB/pages/2519892380/Shared+Package+Maintenance+and+Development)

## Contributing

1. Any github issue that is created needs to be approved by at least three maintainers before development work starts AND the github issue needs to be published to our [slack channel](https://astwebcloud.slack.com/archives/C06865ECFFE). Approval includes: 
  - Maintainers agree that the bug/feature is a good fit for the shared package
  - Maintainers & issue opener have a code design plan of proposed changes - this is documented both in the initial issue and in the conversation following, and should describe any functions' / configs' input/output changes, planned testing, etc. 

2. Once a github issue is approved for development, open a PR, and link again in our package's [slack channel](https://astwebcloud.slack.com/archives/C06865ECFFE).
3. Two maintainers need to review the PR for it to be merged. 

## Development Best Practices

TODO: add some info about best practices

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a full list of changes. We only record minor and major versions in the changelog. 

This document should include a list of each version, and link to the release/tag describing its changes.
# Frontend Shared Packages Constitution

## Core Principles

### I. Public API Compatibility

The public APIs of `@mathstack/app-kit`, `@mathstack/ui`, and `@mathstack/viz` MUST remain backward
compatible by default. Export changes, user-exposed builder methods, configuration types, rendered
behavior, and other consumer-visible contracts MUST be treated as public API changes. Every breaking
change MUST include explicit justification, migration guidance, updated public API and user
documentation, and the semantic version bump required by its impact. This protects consumers of the
published maintenance-mode packages from silent contract changes.

### II. Nx Ownership and Boundaries

Every change MUST identify and remain within its owning Nx project unless a documented contract
requires coordinated changes elsewhere. Implementations MUST reuse established library entry points
and abstractions, MUST NOT create avoidable cross-library coupling, and MUST NOT include unrelated
refactors. Specs and plans MUST name every affected Nx project so project-scoped builds, tests,
linting, and review ownership are explicit.

### III. Risk-Based Validation

Validation MUST scale with user and contract risk. Logic changes MUST have focused unit tests.
Rendered behavior and interaction changes in `ui` or `viz` MUST have focused Cypress component
coverage where the repository's component-test target can exercise them. User-facing component
changes MUST include accessibility validation appropriate to the affected semantics and interaction.
Shared contracts, public APIs, and behavior used across projects MUST receive broader checks in
every affected consumer. The selected checks and any omitted or unavailable checks MUST be recorded
in the change evidence.

### IV. Measured Performance

Performance MUST be treated as observable behavior, not assumed from implementation shape. Before an
optimization, the change MUST record a reproducible baseline scenario and measurement method.
Performance hypotheses MUST remain distinct from measured conclusions. Optimizations MUST preserve
rendering correctness and public behavior, and the same scenario and method MUST produce a
post-change result. Rendering or interaction optimizations MUST include browser-level evidence when
the browser is where the relevant cost or correctness can be observed.

### V. Simple, Established Implementations

Implementations MUST prefer the simplest maintainable approach consistent with the repository's
existing Angular, TypeScript, D3, and RxJS patterns. Code MUST remain fully typed and use the
established public entry-point and feature-module organization. A new dependency or abstraction MUST
demonstrate concrete value that existing dependencies and patterns cannot provide, and its
maintenance and compatibility costs MUST be documented. Complexity without demonstrated value is not
permitted.

## Application Roles

`apps/demo-app` is the canonical documentation and example application for the shared libraries.
Changes to `@mathstack/viz` that affect public APIs, configuration, visual behavior, interaction,
accessibility, or recommended usage MUST update the relevant demo-app documentation and examples
when they would otherwise become incomplete or stale. Every such affected change MUST verify that
the `demo-app` build succeeds.

`apps/my-work` is a workspace for Mathematica designers and developers to create standalone data
visualizations that do not need to be embedded in a hosted application. It supports exploratory and
static-chart work, local data, and an accumulated personal collection of visualizations. It MAY be
used for prototyping and manual validation, but it is not the canonical public documentation site or
a required showcase for every library change. It MUST be modified only when a change affects its
workspace capabilities or a deliberately maintained example.

## Development Workflow

- Specifications and plans MUST identify all affected Nx projects and the contracts connecting them
  before implementation begins.
- Work MUST follow the repository's documented issue approval process before development. When a
  code design is requested, its input, output, configuration, and testing impacts MUST be approved
  as documented before implementation proceeds.
- Changes MUST remain focused and MUST NOT modify unrelated files.
- The existing formatting, linting, build, unit-test, and component-test commands applicable to each
  affected project MUST pass before merge. A command that cannot be run MUST be identified with the
  reason and resulting risk.
- Behavior or contract changes MUST update public exports, API documentation, demo documentation,
  examples, and migration guidance wherever those materials would otherwise be stale.
- Change descriptions and review evidence MUST state assumptions, compatibility risks, and claims
  that remain unverified. Performance changes MUST also record the baseline scenario, measurement
  method, and post-change result.
- Commits MUST use the repository's documented conventional semantic commit format so automated
  package versioning can determine release impact.
- Pull requests MUST complete the documented code review process, including two approving reviewers
  with at least one maintainer, before merge.

## Governance

This constitution governs planning, implementation, and review in this repository. Where another
local practice conflicts with it, this constitution takes precedence unless an amendment is
approved. Pull requests MUST include enough evidence for reviewers to verify compliance with the
applicable principles and workflow rules; reviewers MUST block merge when required evidence,
compatibility handling, or validation is absent.

Amendments MUST be proposed through the repository's issue approval and code review process. Each
amendment MUST document its rationale, affected rules, compatibility or migration consequences, and
requested semantic version change. Constitution versions use semantic versioning: MAJOR for
backward-incompatible governance changes or principle removals and redefinitions, MINOR for new
principles or materially expanded requirements, and PATCH for clarifications that do not change
obligations. Ratification and amendment dates MUST use ISO `YYYY-MM-DD` format.

Compliance MUST be reviewed in every affected specification, plan, and pull request. Maintainers
MUST periodically review repository practices for contradictions with this constitution and use the
amendment process rather than silently weakening a rule.

**Version**: 1.0.0 | **Ratified**: 2026-10-12 | **Last Amended**: 2026-10-12

# Implementation Plan: Improve Bar Label Performance

**Branch**: `improve-bar-rendering-performance` | **Date**: 2026-10-12 | **Spec**:
[spec.md](spec.md)

**Input**: Feature specification from `/specs/001-improve-bar-label-performance/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the
execution workflow.

## Summary

Reduce browser layout work for approximately 50 labeled bars without changing the `@mathstack/viz`
public API or rendered behavior. Refactor the shared bar-label update into explicit text-write,
geometry-read, and placement-write phases; retain valid dimensions in a private element-owned weak
cache; invalidate on rendered content, formatting, typography, element, or web-font changes; and
preserve current placement transitions. Establish a production-browser baseline before optimization
and compare the completed path with the same demo scenario and method.

## Technical Context

**Language/Version**: TypeScript 6.0.3 with Angular 22.1.x templates and SCSS

**Primary Dependencies**: Angular 22.1.8, D3 7.x, RxJS 7.5.x, Nx 23.2.1; browser SVG DOM and CSS
Font Loading APIs; no new runtime dependency

**Storage**: No persistent storage; private in-memory `WeakMap` measurement records scoped to each
bar component instance

**Testing**: Jasmine/Karma unit tests in Chrome, Cypress 15 component tests, existing visual and
behavioral suites, and controlled Chrome Performance traces against a production `demo-app` build;
the existing misspelled `demo-app:build:devleopment` component-test target MUST be characterized and
corrected to `development` only if it blocks the required Cypress command

**Target Platform**: Browsers supported by Angular 22 with SVG text geometry; CSS Font Loading API
behavior is feature-detected and guarded

**Project Type**: Nx Angular monorepo containing a published visualization library and canonical
documentation application

**Performance Goals**: Over at least 20 runs, reduce median main-thread label-rendering and
synchronous-layout time for unchanged-text warm updates by at least 50%; reuse all eligible
measurements; introduce no attributable long task of 50 ms or greater

**Constraints**: Preserve public configuration, rendered text, placement, color, visibility,
transitions, accessibility, positive/negative/zero/no-value behavior, and existing inside/outside
policy; measure current text; do not retain exited elements; do not visibly render hidden labels

**Scale/Scope**: Approximately 50 visible labeled bars across standard and grouped bars plus each
stacked configuration proven to use the shared path; affected Nx projects are `viz` and `demo-app`

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Gate                              | Pre-Research | Post-Design | Evidence                                                                                                                                           |
| --------------------------------- | ------------ | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public API compatibility          | PASS         | PASS        | Contract adds no exports, options, or consumer actions; existing label behavior remains normative.                                                 |
| Nx ownership and boundaries       | PASS         | PASS        | Rendering and tests remain in `viz`; canonical example and evidence remain in `demo-app`; `my-work` is excluded.                                   |
| Risk-based validation             | PASS         | PASS        | Unit call-count/invalidation tests, Cypress rendered behavior and accessibility checks, variant coverage, and both affected builds are required.   |
| Measured performance              | PASS         | PASS        | Baseline precedes optimization; four scenarios use identical browser, hardware, data, run count, and trace method before and after.                |
| Simple established implementation | PASS         | PASS        | Private weak cache, D3 selections, browser APIs, and inherited `DestroyRef` use existing patterns with no new dependency or public abstraction.    |
| Application roles                 | PASS         | PASS        | `demo-app` owns the representative example and must build in production; `my-work` remains untouched unless explicitly documented for exploration. |
| Development workflow              | PASS         | PASS        | Plan names all affected projects, preserves focused scope, records assumptions and risks, and requires existing lint/build/test commands.          |

No constitutional gate requires an exception. Phase 1 design preserves the pre-research result.

## Project Structure

### Documentation (this feature)

```text
specs/001-improve-bar-label-performance/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/
│   └── public-api-and-rendering-contract.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
libs/viz/src/lib/
├── bars/
│   ├── bars.component.ts
│   ├── bars.component.spec.ts
│   └── config/labels/bars-labels.cy.ts
├── grouped-bars/
│   └── grouped-bars.component.spec.ts
└── stacked-bars/
    └── stacked-bars.component.spec.ts

libs/viz/project.json              # Only if the existing Cypress target spelling blocks validation

apps/demo-app/src/app/content/viz/bars-content/
├── bars-content.component.html
└── bars-example/
    ├── bars-example.component.ts
    ├── bars-example.component.html
    └── bars-example.component.scss

apps/demo-app/src/assets/viz/content/
└── bars.md
```

**Structure Decision**: Keep implementation in the existing `viz` bar component and its nearest
tests. Extend the existing canonical bars example and documentation in `demo-app`. Add no project,
shared service, or `my-work` change. Stacked-bar work is limited to characterization and minimal
wiring only if its existing label configuration is proven to invoke the shared contract.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitution violations require complexity justification.

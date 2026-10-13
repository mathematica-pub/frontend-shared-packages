# Bar Label Performance Results

## Status

- **Feature**: Improve Bar Label Performance
- **Evidence status**: Baseline and post-change measured; deterministic reuse passes, but the warm
  browser timing threshold does not.
- **Forced-layout conclusion**: Label geometry reads contributed to synchronous layout. Eliminating
  eligible reads reduced warm layout by 33.9% and scale-only layout by 87.8% in this setup, but did
  not establish them as the sole cause of bounded warm-update work.

## Environment

The baseline and post-change rows MUST use identical values unless a deviation is explicitly noted.

| Field                    | Baseline                                                                                                                                                       | Post-change                                             |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Date                     | 2026-10-12                                                                                                                                                     | 2026-10-12                                              |
| Git commit               | `0be993540a3c4640f6af53741ca799d42bc0a673` plus working-tree feature changes                                                                                   | Same commit plus completed working-tree feature changes |
| Operating system         | Microsoft Windows 11 Enterprise 10.0.26200                                                                                                                     | Same as baseline                                        |
| CPU                      | Intel Core Ultra 7 165U, 14 browser logical processors reported                                                                                                | Same as baseline                                        |
| Memory                   | 31.5 GiB OS-visible; 32 GiB browser-reported                                                                                                                   | Same as baseline                                        |
| Display scale            | Browser `devicePixelRatio` 1                                                                                                                                   | Same as baseline                                        |
| Browser and version      | Headless Google Chrome 154.0.8037.99, CDP protocol 1.3                                                                                                         | Same as baseline                                        |
| Browser profile          | Isolated temporary profile at `%TEMP%/bar-label-performance-chrome`                                                                                            | Same as baseline                                        |
| Viewport                 | Chrome window 1440 x 900; browser content viewport 1418 x 802                                                                                                  | Same as baseline                                        |
| CPU/network throttling   | None                                                                                                                                                           | Same as baseline                                        |
| Production build command | `npm run build:demo-app -- --output-style=static`; serve `dist/demo-app/browser` with local `http-server`                                                      | Same as baseline                                        |
| Route                    | `http://localhost:4300/viz/content/primary-marks/bars`                                                                                                         | Same as baseline                                        |
| Dataset                  | All 45 unique metro divisions from the April 2008 snapshot                                                                                                     | Same as baseline                                        |
| Warm-up policy           | Load once, wait for `bars-label-initial-render`, then run each update control once before update trace capture; initial traces use warm browser/profile caches | Same as baseline                                        |
| Runs per scenario        | At least 20                                                                                                                                                    | Same as baseline                                        |
| Measurement method       | Chrome CDP trace bounded by named User Timing marks; sum renderer-main-thread `RunTask` and synchronous `Layout` durations wholly inside the interval          | Same as baseline                                        |

## Scenario Definitions

| Scenario                    | Trigger                                         | Label text                 | Typography           | Geometry                           |
| --------------------------- | ----------------------------------------------- | -------------------------- | -------------------- | ---------------------------------- |
| Initial render              | Load the canonical approximately 50-bar example | Initial strings            | Initial styles/fonts | Initial chart                      |
| Warm unchanged-text update  | Use the deterministic warm-update control       | Unchanged                  | Unchanged            | Changed bar/chart placement inputs |
| Changed-text update         | Use the deterministic changed-text control      | One or more strings change | Unchanged            | Current geometry                   |
| Resize or scale-only update | Use the deterministic resize/scale control      | Unchanged                  | Unchanged            | Chart range or scale changes       |

## Run Procedure

1. Start the production `demo-app` build and open the Bars route.
2. Use the same browser profile, viewport, throttling, data, and warm-up policy for every run.
3. Start a Performance recording with screenshots disabled.
4. Trigger exactly one scenario and stop after its named User Timing end mark.
5. Within those boundaries, record label-update main-thread time, synchronous `Layout` time, and any
   attributable task of at least 50 ms.
6. Export or reference the trace and reset the scenario before the next run.
7. Retain every raw value; calculate medians after all runs without silently discarding outliers.

The production artifact was built successfully and served from `dist/demo-app/browser` on port 4300.
The repository's documented development route `/viz/bars` redirects to the overview; the concrete
route verified against the current router is `/viz/content/primary-marks/bars`. Before trace
capture, browser automation verified the canonical example contains 45 labels, warm update changes
zero rendered strings, changed-text update changes exactly one string, and resize changes zero
strings while changing the chart width from 800 px to 640 px. The four named measures
`bars-label-initial-render`, `bars-label-warm-update`, `bars-label-changed-text`, and
`bars-label-scale-only` were all observed. These boundary durations are harness verification only,
not baseline performance results.

## Raw Runs

Enter one row per run. Duplicate the table for each scenario and evidence stage as needed.

### Baseline: Initial Render

| Run | Label update (ms) | Synchronous layout (ms) | Long task >= 50 ms   | Trace reference                                    | Notes |
| --- | ----------------- | ----------------------- | -------------------- | -------------------------------------------------- | ----- |
| 1   | 146.52            | 57.976                  | No                   | traces/baseline/baseline-initial-render-01.json.gz |       |
| 2   | 235.626           | 96.417                  | No                   | traces/baseline/baseline-initial-render-02.json.gz |       |
| 3   | 231.259           | 96.994                  | No                   | traces/baseline/baseline-initial-render-03.json.gz |       |
| 4   | 258.228           | 83.718                  | 1, longest 69.072 ms | traces/baseline/baseline-initial-render-04.json.gz |       |
| 5   | 189.378           | 71.891                  | No                   | traces/baseline/baseline-initial-render-05.json.gz |       |
| 6   | 182.088           | 73.372                  | No                   | traces/baseline/baseline-initial-render-06.json.gz |       |
| 7   | 295.619           | 130.27                  | 1, longest 65.692 ms | traces/baseline/baseline-initial-render-07.json.gz |       |
| 8   | 210.959           | 77.762                  | No                   | traces/baseline/baseline-initial-render-08.json.gz |       |
| 9   | 238.721           | 86.199                  | No                   | traces/baseline/baseline-initial-render-09.json.gz |       |
| 10  | 215.824           | 78.634                  | No                   | traces/baseline/baseline-initial-render-10.json.gz |       |
| 11  | 432.847           | 87.383                  | 1, longest 79.229 ms | traces/baseline/baseline-initial-render-11.json.gz |       |
| 12  | 193.842           | 71.976                  | No                   | traces/baseline/baseline-initial-render-12.json.gz |       |
| 13  | 167.341           | 59.254                  | No                   | traces/baseline/baseline-initial-render-13.json.gz |       |
| 14  | 162.996           | 57.245                  | No                   | traces/baseline/baseline-initial-render-14.json.gz |       |
| 15  | 216.218           | 77.607                  | No                   | traces/baseline/baseline-initial-render-15.json.gz |       |
| 16  | 221.539           | 82.929                  | No                   | traces/baseline/baseline-initial-render-16.json.gz |       |
| 17  | 249.515           | 96.169                  | No                   | traces/baseline/baseline-initial-render-17.json.gz |       |
| 18  | 287.687           | 113.239                 | 1, longest 67.414 ms | traces/baseline/baseline-initial-render-18.json.gz |       |
| 19  | 500.231           | 89.625                  | 1, longest 95.689 ms | traces/baseline/baseline-initial-render-19.json.gz |       |
| 20  | 264.268           | 104.85                  | No                   | traces/baseline/baseline-initial-render-20.json.gz |       |

### Baseline: Warm Unchanged-Text Update

| Run | Label update (ms) | Synchronous layout (ms) | Long task >= 50 ms | Trace reference                                 | Notes |
| --- | ----------------- | ----------------------- | ------------------ | ----------------------------------------------- | ----- |
| 1   | 100.312           | 23.165                  | No                 | traces/baseline/baseline-warm-update-01.json.gz |       |
| 2   | 128.426           | 36.92                   | No                 | traces/baseline/baseline-warm-update-02.json.gz |       |
| 3   | 133.359           | 33.943                  | No                 | traces/baseline/baseline-warm-update-03.json.gz |       |
| 4   | 104.896           | 25.913                  | No                 | traces/baseline/baseline-warm-update-04.json.gz |       |
| 5   | 110.895           | 29.656                  | No                 | traces/baseline/baseline-warm-update-05.json.gz |       |
| 6   | 118.099           | 28.527                  | No                 | traces/baseline/baseline-warm-update-06.json.gz |       |
| 7   | 101.942           | 24.438                  | No                 | traces/baseline/baseline-warm-update-07.json.gz |       |
| 8   | 97.185            | 22.865                  | No                 | traces/baseline/baseline-warm-update-08.json.gz |       |
| 9   | 100.441           | 24.931                  | No                 | traces/baseline/baseline-warm-update-09.json.gz |       |
| 10  | 96.485            | 22.492                  | No                 | traces/baseline/baseline-warm-update-10.json.gz |       |
| 11  | 100.609           | 29.156                  | No                 | traces/baseline/baseline-warm-update-11.json.gz |       |
| 12  | 91.773            | 21.99                   | No                 | traces/baseline/baseline-warm-update-12.json.gz |       |
| 13  | 100.174           | 25.572                  | No                 | traces/baseline/baseline-warm-update-13.json.gz |       |
| 14  | 108.286           | 22.396                  | No                 | traces/baseline/baseline-warm-update-14.json.gz |       |
| 15  | 107.272           | 24.033                  | No                 | traces/baseline/baseline-warm-update-15.json.gz |       |
| 16  | 93.596            | 20.175                  | No                 | traces/baseline/baseline-warm-update-16.json.gz |       |
| 17  | 95.749            | 20.414                  | No                 | traces/baseline/baseline-warm-update-17.json.gz |       |
| 18  | 94.291            | 24.683                  | No                 | traces/baseline/baseline-warm-update-18.json.gz |       |
| 19  | 289.978           | 20.78                   | No                 | traces/baseline/baseline-warm-update-19.json.gz |       |
| 20  | 92.432            | 22.315                  | No                 | traces/baseline/baseline-warm-update-20.json.gz |       |

### Baseline: Changed-Text Update

| Run | Label update (ms) | Synchronous layout (ms) | Long task >= 50 ms | Trace reference                                  | Notes |
| --- | ----------------- | ----------------------- | ------------------ | ------------------------------------------------ | ----- |
| 1   | 92.883            | 22.198                  | No                 | traces/baseline/baseline-changed-text-01.json.gz |       |
| 2   | 91.531            | 23.528                  | No                 | traces/baseline/baseline-changed-text-02.json.gz |       |
| 3   | 93.764            | 21.905                  | No                 | traces/baseline/baseline-changed-text-03.json.gz |       |
| 4   | 86.528            | 21.816                  | No                 | traces/baseline/baseline-changed-text-04.json.gz |       |
| 5   | 85.448            | 19.65                   | No                 | traces/baseline/baseline-changed-text-05.json.gz |       |
| 6   | 88.709            | 21.935                  | No                 | traces/baseline/baseline-changed-text-06.json.gz |       |
| 7   | 84.724            | 23.758                  | No                 | traces/baseline/baseline-changed-text-07.json.gz |       |
| 8   | 89.361            | 23.281                  | No                 | traces/baseline/baseline-changed-text-08.json.gz |       |
| 9   | 88.193            | 24.459                  | No                 | traces/baseline/baseline-changed-text-09.json.gz |       |
| 10  | 83.11             | 20.347                  | No                 | traces/baseline/baseline-changed-text-10.json.gz |       |
| 11  | 88.625            | 21.286                  | No                 | traces/baseline/baseline-changed-text-11.json.gz |       |
| 12  | 85.853            | 20.923                  | No                 | traces/baseline/baseline-changed-text-12.json.gz |       |
| 13  | 84.911            | 23.691                  | No                 | traces/baseline/baseline-changed-text-13.json.gz |       |
| 14  | 96.805            | 28.938                  | No                 | traces/baseline/baseline-changed-text-14.json.gz |       |
| 15  | 139.108           | 21.89                   | No                 | traces/baseline/baseline-changed-text-15.json.gz |       |
| 16  | 87.948            | 22.382                  | No                 | traces/baseline/baseline-changed-text-16.json.gz |       |
| 17  | 87.465            | 20.327                  | No                 | traces/baseline/baseline-changed-text-17.json.gz |       |
| 18  | 90.729            | 22.394                  | No                 | traces/baseline/baseline-changed-text-18.json.gz |       |
| 19  | 87.339            | 22.051                  | No                 | traces/baseline/baseline-changed-text-19.json.gz |       |
| 20  | 92.761            | 27.546                  | No                 | traces/baseline/baseline-changed-text-20.json.gz |       |

### Baseline: Resize or Scale-Only Update

| Run | Label update (ms) | Synchronous layout (ms) | Long task >= 50 ms   | Trace reference                                | Notes |
| --- | ----------------- | ----------------------- | -------------------- | ---------------------------------------------- | ----- |
| 1   | 103.794           | 46.115                  | No                   | traces/baseline/baseline-scale-only-01.json.gz |       |
| 2   | 117.666           | 56.504                  | No                   | traces/baseline/baseline-scale-only-02.json.gz |       |
| 3   | 115.435           | 60.911                  | No                   | traces/baseline/baseline-scale-only-03.json.gz |       |
| 4   | 184.697           | 72.389                  | 1, longest 55.186 ms | traces/baseline/baseline-scale-only-04.json.gz |       |
| 5   | 138.595           | 67.4                    | No                   | traces/baseline/baseline-scale-only-05.json.gz |       |
| 6   | 110.227           | 54.32                   | No                   | traces/baseline/baseline-scale-only-06.json.gz |       |
| 7   | 105.824           | 51.737                  | No                   | traces/baseline/baseline-scale-only-07.json.gz |       |
| 8   | 100.35            | 48.24                   | No                   | traces/baseline/baseline-scale-only-08.json.gz |       |
| 9   | 110.717           | 51.235                  | No                   | traces/baseline/baseline-scale-only-09.json.gz |       |
| 10  | 95.111            | 43.845                  | No                   | traces/baseline/baseline-scale-only-10.json.gz |       |
| 11  | 106.386           | 51.862                  | No                   | traces/baseline/baseline-scale-only-11.json.gz |       |
| 12  | 126.348           | 44.199                  | No                   | traces/baseline/baseline-scale-only-12.json.gz |       |
| 13  | 119.673           | 54.971                  | No                   | traces/baseline/baseline-scale-only-13.json.gz |       |
| 14  | 115.784           | 56.148                  | No                   | traces/baseline/baseline-scale-only-14.json.gz |       |
| 15  | 115.929           | 52.144                  | No                   | traces/baseline/baseline-scale-only-15.json.gz |       |
| 16  | 128.93            | 59.328                  | No                   | traces/baseline/baseline-scale-only-16.json.gz |       |
| 17  | 105.559           | 47.801                  | No                   | traces/baseline/baseline-scale-only-17.json.gz |       |
| 18  | 117.945           | 56.803                  | No                   | traces/baseline/baseline-scale-only-18.json.gz |       |
| 19  | 150.922           | 57.232                  | No                   | traces/baseline/baseline-scale-only-19.json.gz |       |
| 20  | 114.188           | 49.358                  | No                   | traces/baseline/baseline-scale-only-20.json.gz |       |

### Post-Change: Initial Render

| Run  | Label update (ms)                                 | Synchronous layout (ms) | Long task >= 50 ms | Trace reference                                                              | Notes                                                             |
| ---- | ------------------------------------------------- | ----------------------- | ------------------ | ---------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 1-20 | See `traces/post-change/post-change-summary.json` | See summary             | No runs            | Local captures `post-change-initial-render-01.json.gz` through `-20.json.gz` | All raw metrics retained in summary; generated traces are ignored |

### Post-Change: Warm Unchanged-Text Update

| Run  | Label update (ms)                                 | Synchronous layout (ms) | Long task >= 50 ms | Trace reference                                                           | Notes                                                             |
| ---- | ------------------------------------------------- | ----------------------- | ------------------ | ------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 1-20 | See `traces/post-change/post-change-summary.json` | See summary             | No runs            | Local captures `post-change-warm-update-01.json.gz` through `-20.json.gz` | All raw metrics retained in summary; generated traces are ignored |

### Post-Change: Changed-Text Update

| Run  | Label update (ms)                                 | Synchronous layout (ms) | Long task >= 50 ms | Trace reference                                                            | Notes                                                             |
| ---- | ------------------------------------------------- | ----------------------- | ------------------ | -------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 1-20 | See `traces/post-change/post-change-summary.json` | See summary             | No runs            | Local captures `post-change-changed-text-01.json.gz` through `-20.json.gz` | All raw metrics retained in summary; generated traces are ignored |

### Post-Change: Resize or Scale-Only Update

| Run  | Label update (ms)                                 | Synchronous layout (ms) | Long task >= 50 ms | Trace reference                                                          | Notes                                                             |
| ---- | ------------------------------------------------- | ----------------------- | ------------------ | ------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| 1-20 | See `traces/post-change/post-change-summary.json` | See summary             | No runs            | Local captures `post-change-scale-only-01.json.gz` through `-20.json.gz` | All raw metrics retained in summary; generated traces are ignored |

## Median Comparison

| Scenario            | Metric             | Baseline median | Post-change median | Change       | Acceptance              |
| ------------------- | ------------------ | --------------- | ------------------ | ------------ | ----------------------- |
| Initial render      | Label update       | 226.399 ms      | 208.1355 ms        | 8.1% lower   | Informational           |
| Initial render      | Synchronous layout | 83.3235 ms      | 52.2425 ms         | 37.3% lower  | Informational           |
| Warm unchanged-text | Label update       | 100.525 ms      | 117.699 ms         | 17.1% higher | **Fail**: not 50% lower |
| Warm unchanged-text | Synchronous layout | 24.2355 ms      | 16.0175 ms         | 33.9% lower  | **Fail**: not 50% lower |
| Changed text        | Label update       | 88.409 ms       | 97.1575 ms         | 9.9% higher  | Informational           |
| Changed text        | Synchronous layout | 22.1245 ms      | 15.9205 ms         | 28.0% lower  | Informational           |
| Resize/scale-only   | Label update       | 115.6095 ms     | 80.71 ms           | 30.2% lower  | Informational           |
| Resize/scale-only   | Synchronous layout | 53.232 ms       | 6.515 ms           | 87.8% lower  | Informational           |

## Deterministic Measurement-Reuse Evidence

| Scenario                                  | Expected geometry reads           | Observed                                                     | Status |
| ----------------------------------------- | --------------------------------- | ------------------------------------------------------------ | ------ |
| Cold render                               | Once per visible label            | Two reads for two labels                                     | Pass   |
| Warm unchanged text/typography            | Zero for eligible existing labels | Zero additional reads                                        | Pass   |
| One changed rendered string               | Changed label only                | One additional read                                          | Pass   |
| Typography or formatter invalidation      | Affected labels                   | Unit validity checks and browser formatter identity behavior | Pass   |
| Resize, scale, value, or orientation only | Zero for eligible existing labels | Zero reads; current placement changes                        | Pass   |
| New label enters                          | New element only                  | Element-keyed WeakMap record                                 | Pass   |
| Hidden labels                             | Zero                              | Measurement bypass and record removal                        | Pass   |

## Quality Gates

| Command or review                                                  | Baseline/result                                                                                                           | Final result                                                                                                   | Status/risk                                        |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `npm run cypress:component:viz` pre-feature characterization       | Runner opened an uncaptured alternate buffer; `libs/viz/project.json` referenced nonexistent `demo-app:build:devleopment` | Nx target now resolves `demo-app:build:development`                                                            | Initial runner issue resolved for final validation |
| `npm run lint:viz`                                                 | Not required for baseline                                                                                                 | Passed                                                                                                         | Pass                                               |
| `npm run build:viz`                                                | Not required for baseline                                                                                                 | Passed                                                                                                         | Pass; existing Angular builder deprecation warning |
| `npx nx test viz --watch=false --browsers=ChromeHeadlessNoSandbox` | Not required for baseline                                                                                                 | 694/694 passing                                                                                                | Pass                                               |
| `npm run cypress:component:viz`                                    | Baseline characterization above                                                                                           | 18 specs, 419/419 passing in Chrome 154                                                                        | Pass                                               |
| `npm run lint:demo-app`                                            | Not required for baseline                                                                                                 | Passed                                                                                                         | Pass                                               |
| `npm run build:demo-app`                                           | Passed after canonical scenario changes; existing bundle-budget and CommonJS warnings remain                              | Passed with same warnings                                                                                      | Pass                                               |
| Existing `bars-labels.cy.ts` Cypress spec                          | Not required for baseline                                                                                                 | 51/51 passing in Chrome 154, including cache test                                                              | Pass                                               |
| Public API contract audit                                          | Not applicable                                                                                                            | No changes to `public-api.ts`, bars exports, selectors, inputs, outputs, builders, or required consumer action | Pass                                               |
| Scope audit                                                        | Not applicable                                                                                                            | `apps/my-work` and unrelated marks, axes, and tooltip implementation files unchanged                           | Pass                                               |

## Stacked-Label Characterization

- **Current shared-path support**: Configured labels invoke inherited `BarsComponent.drawLabels()`,
  but operational stacked-label rendering is pre-existing unsupported behavior.
- **Evidence**: Focused `stacked-bars.component.spec.ts` characterization passes in Chrome
  Headless 154. `StackedBarsComponent.drawBars()` populates `stackedBarGroups` while leaving the
  inherited `barGroups` selection undefined; `drawLabels()` requires `barGroups`.
- **Implementation decision**: Preserve the unsupported boundary and make no stacked-bars
  implementation change in this performance feature. Shared-path parity assertions are not
  applicable unless a separate feature first establishes stacked-label support.

## Limitations

- Compact machine-generated metrics are retained in `traces/baseline/baseline-summary.json` and
  `traces/post-change/post-change-summary.json`. Raw Chrome traces are local generated artifacts,
  ignored by Git, and reproducible with the capture helper.
- "Label update" is the sum of renderer-main-thread `ThreadControllerImpl::RunTask` durations wholly
  contained between the named marks. It includes chart work in that bounded scenario and is not a
  function-level attribution solely to `drawLabels()`.
- `npx nx serve demo-app --configuration=production` remained in project-graph creation without a
  ready signal in the captured terminal. The successfully built production artifact was therefore
  served with the repository-local `http-server` package for browser verification.
- The VS Code terminal integration initially diverted Cypress output into an alternate buffer. Final
  validation captured Cypress through a child-process pipe and confirmed all 18 specs pass.
- The focused Cypress cache test was reintroduced by later user direction. It freezes Font Loading
  API callbacks because font invalidation is a separate concern and otherwise races its call-count
  assertions in the component iframe.
- Focused unit cache evidence: two cold labels call `getBBox()` twice; an unchanged redraw remains
  at two total calls; changing one rendered string increases the total to three; the records are
  owned by a `WeakMap<SVGTextElement, RenderedLabelMeasurement>`.
- Browser traces describe only the recorded environment and are not general performance guarantees.
- Automated geometry-read assertions validate cache behavior but do not replace browser timing.

## Unverified Browser-Specific Risks

- CSS Font Loading API event behavior in browsers other than the measured browser remains unverified
  unless separately recorded.
- The bounded main-thread metric includes chart and bar work in addition to `drawLabels()`; it is
  not a function-level label-only measurement. That broader boundary prevented the 50% warm timing
  gate despite deterministic elimination of eligible `getBBox()` reads.

## Final Acceptance

| Criterion | Result   | Evidence                                                                                                            |
| --------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| SC-001    | **Fail** | Warm main-thread increased 17.1%; warm layout decreased 33.9%, below the required 50% reductions                    |
| SC-002    | Pass     | Unit and Cypress deterministic reuse tests                                                                          |
| SC-003    | Pass     | One changed string causes one additional geometry read                                                              |
| SC-004    | Pass     | No post-change scenario produced an attributable task of at least 50 ms                                             |
| SC-005    | Pass     | 694/694 unit and 419/419 Cypress checks pass                                                                        |
| SC-006    | Pass     | Quickstart and complete baseline/post-change metric summaries retained; raw traces are reproducible local artifacts |
| SC-007    | Pass     | 45-label responsive example with named controls and live status                                                     |
| SC-008    | Pass     | All affected lint, build, unit, and component gates recorded                                                        |

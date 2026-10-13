# Quickstart: Validate Bar Label Performance

## Prerequisites

- Install dependencies with the repository-supported Node/npm environment: `npm ci`.
- Use a Chromium browser with DevTools Performance recording and User Timing support.
- Record browser version, operating system, CPU, memory, display scale, viewport, and any
  throttling.
- Use the same machine, browser profile, viewport, dataset, and settings for baseline and
  post-change runs.

Read [data-model.md](data-model.md) for validity rules and
[public-api-and-rendering-contract.md](contracts/public-api-and-rendering-contract.md) for preserved
behavior.

## 1. Establish the baseline first

Create the canonical deterministic interaction in the Bars example before changing label rendering.
The example MUST show approximately 50 visible labels and expose these actions without changing
consumer-facing library configuration:

1. Warm update that changes geometry while preserving rendered label strings and typography.
2. Update that changes one or more rendered label strings.
3. Resize or scale-only update.

Add named User Timing boundaries around each action in the demo harness. Do not add benchmark APIs
to the published library.

Build the canonical app with its production configuration and serve the browser artifact:

```powershell
npm run build:demo-app -- --output-style=static
npx http-server dist/demo-app/browser -p 4300
```

Open `http://localhost:4300/viz/content/primary-marks/bars`. Confirm the example has 45 visible
labeled bars and every action is deterministic.

## 2. Record browser evidence

For each of these scenarios, capture at least 20 measured runs:

- Initial page/chart rendering.
- Warm update with unchanged label strings.
- Update with changed label strings.
- Resize or scale-only update.

For each run:

1. Open the browser Performance panel with screenshots disabled and consistent CPU throttling.
2. Start recording, trigger exactly one named scenario, wait for its User Timing end marker, and
   stop.
3. Within the scenario boundaries, record main-thread label-update duration and synchronous `Layout`
   duration.
4. Record any attributable long task of 50 ms or greater.
5. Save the raw value and exported trace reference.

Compute medians only after retaining raw runs. Document warm-up policy, outlier handling,
environment, limitations, and browser-specific risks. Treat forced layout as a hypothesis until the
traces support it.

The repository capture helper automates the same four scenarios through Chrome's DevTools protocol:

```powershell
node scripts/capture-bar-label-performance.mjs post-change http://localhost:4300/viz/content/primary-marks/bars 20
```

## 3. Validate measurement reuse deterministically

Automated tests MUST spy on SVG label geometry measurement rather than assert wall-clock timing:

- Cold render measures each visible label once.
- An unchanged-text and unchanged-typography update reuses all eligible records.
- Changing one rendered string remeasures that label while unchanged elements reuse records.
- Formatter identity, no-value formatter, computed typography, and font-generation changes
  invalidate affected records.
- Resize, scale, bar-value, and orientation changes recalculate placement without invalidating valid
  dimensions.
- Entered labels measure cold; exited labels are removable; reorder does not borrow incompatible
  records.
- Hidden labels remain hidden and do not call geometry measurement.
- Transitioned updates measure current text.

Characterize stacked-label support before changing its group selection. Test grouped bars through
the shared path and add stacked parity only where the existing contract is proven.

## 4. Run focused and project checks

Run the narrow tests while implementing, then all affected-project gates:

```powershell
npm run lint:viz
npm run build:viz
npx nx test viz --watch=false --browsers=ChromeHeadlessNoSandbox
npm run cypress:component:viz
npm run lint:demo-app
npm run build:demo-app
```

Before changing feature code, record whether `npm run cypress:component:viz` is blocked by the
existing `demo-app:build:devleopment` target reference in `libs/viz/project.json`. If it is, correct
only that reference to the existing `development` configuration and preserve the failure output as
an explicit pre-existing validation issue.

Also verify existing label component scenarios for positive, negative, zero, no-value,
inside/outside, color, visibility, resize, grouping, transitions, and accessibility semantics.
Record any unavailable command with its reason and resulting risk.

## 5. Compare completed behavior

Repeat Section 2 without changing environment, data, run count, actions, User Timing boundaries, or
trace method. Acceptance requires:

- At least 50% lower median main-thread label-rendering and synchronous-layout time for
  unchanged-text warm updates.
- Reuse of all eligible unchanged measurements.
- Selective invalidation when one label changes.
- No new attributable long task of 50 ms or greater in a tested 50-bar update.
- No rendering-contract regression.

Report baseline and post-change raw results, medians, trace references, limitations, and unverified
browser-specific risks. State that measurements apply to the recorded setup and are not general
performance guarantees.

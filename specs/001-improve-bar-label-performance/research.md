# Phase 0 Research: Improve Bar Label Performance

## Decision 1: Keep the change inside the existing bar-label path

**Decision**: Optimize `BarsComponent.drawLabels()` and its direct helpers without changing exported
configuration, selection observables, component selectors, or builder APIs. Treat `viz` as the
owning project and `demo-app` as the only required consumer project.

**Rationale**: Standard and grouped bars use the shared method, and the published label contract
already contains all required behavior. The feature is transparent to consumers and the constitution
requires changes to remain in the owning library.

**Alternatives considered**:

- Add a consumer-facing cache option: rejected because it changes the public contract and makes
  consumers responsible for an internal optimization.
- Introduce a shared rendering service: rejected because one component owns the affected path and a
  new abstraction would add coupling without demonstrated value.
- Update `my-work`: rejected because it is not the canonical example and its capabilities are not
  affected.

## Decision 2: Use explicit write, read, and write phases

**Decision**: Refactor label rendering into these ordered phases:

1. Join labels, set `display`, hide visible labels with the correctly spelled `visibility`
   attribute, and write the current label text synchronously for the full selection.
2. Read computed typography and geometry for cache misses only, after all text writes complete.
3. Calculate placement from current chart and bar geometry, then write color, anchor, baseline,
   coordinates, and final visibility for the full selection. Placement attributes may retain the
   existing transition behavior, but text MUST already be current before measurement.

**Rationale**: The current update branch schedules `.text()` on a transition and immediately calls
`getBBox()`, which can measure the old text. It also performs placement writes inside the same
per-label loop as geometry reads. The phased order makes current-text measurement explicit and
prevents write/read alternation per label.

**Alternatives considered**:

- Keep text on the transition and wait for an end callback: rejected because labels would be
  measured and placed late, and interrupted transitions complicate correctness.
- Clone labels into an off-screen measurement surface: rejected because inherited styles and
  web-font timing would be harder to reproduce and hidden clones would add DOM work.
- Measure every label after batching writes: rejected because it removes interleaving but does not
  meet warm-update measurement reuse requirements.

## Decision 3: Cache measurements per label element with weak ownership

**Decision**: Store measurement records in a `WeakMap<SVGTextElement, RenderedLabelMeasurement>`.
Each record contains rendered text, a typography fingerprint, formatting identities, a
font-generation value, width, and height. Reuse a record only when every validity field matches the
current element and configuration. A new element always misses.

**Rationale**: Each keyed bar group owns one label element. Stable elements retain measurements
across value, scale, resize, and orientation updates; changed text invalidates only its element.
Weak keys allow exited elements and their records to be garbage-collected, avoiding explicit
unbounded maps and preventing reordered data from borrowing an incompatible measurement.

**Alternatives considered**:

- Global map keyed by ordinal and quantitative values: rejected because geometry identity is not
  text measurement identity, values change frequently, and removed data can accumulate.
- Global map keyed only by text and typography: rejected because the specification requires new
  label elements to bypass cached measurements and global unique strings can grow without bound.
- Index-keyed array: rejected because reordering can associate stale content with a different label.
- Store records on DOM elements: rejected because it exposes internal state on rendered nodes and is
  less type-safe than a private weak cache.

## Decision 4: Derive validity from rendered output and computed typography

**Decision**: Build the typography fingerprint during the read phase from computed properties that
can affect text dimensions, including font family, size, weight, style, stretch, variant, line
height, letter spacing, word spacing, text transform, text rendering, and writing mode. Also retain
the current format function identity, format specifier, and no-value function identity in the
record. The rendered text itself is always part of validity.

**Rationale**: Rendered output catches data and formatter-result changes. Function/specifier
identity ensures formatting configuration changes invalidate even if a sample happens to produce the
same string. Computed style captures stylesheet and inherited typography without adding public
config. Placement inputs such as chart size, scales, orientation, bar value, offset, and colors are
excluded because they do not change text dimensions and are recalculated every draw.

**Alternatives considered**:

- Use only label text: rejected because identical text can have different dimensions after
  typography or font changes.
- Use configuration object identity: rejected because builders can create new equivalent objects and
  CSS typography is external to configuration.
- Include bar and chart geometry in the key: rejected because it would prevent valid reuse during
  the resize and scale-only scenarios the feature targets.

## Decision 5: Invalidate and redraw when web-font availability changes

**Decision**: Track a component-level font generation. When the document font set reports readiness
or a `loadingdone` event after measurements exist, increment the generation, clear the weak cache by
replacing it, and redraw labels without animation from current data. Register at most one listener
per component and remove it with the inherited `DestroyRef` cleanup hook. Guard the behavior for
browsers or test environments without the CSS Font Loading API.

**Rationale**: Computed font-family values can remain unchanged while glyph metrics change after a
web font loads. A generation mismatch invalidates all earlier records, and an immediate redraw
corrects placement even if no later chart update occurs.

**Alternatives considered**:

- Depend only on `document.fonts.ready`: rejected because later font loads can occur after the
  initial ready promise resolves.
- Invalidate without redrawing: rejected because stale placement could remain visible indefinitely.
- Poll font status on every draw: rejected because it adds recurring work and still cannot reliably
  identify when glyph metrics changed.

## Decision 6: Bypass measurement for hidden labels

**Decision**: When label display is disabled, keep label elements at `display: none`, do not call
geometry measurement, and do not reveal them during any phase. When display becomes enabled, treat
those elements as cache misses and run the normal phased path.

**Rationale**: Hidden SVG text can report unusable dimensions and measuring it creates work with no
visible benefit. The explicit bypass prevents flashes and makes the later visible render a cold,
correct measurement.

**Alternatives considered**:

- Temporarily display hidden labels off-screen: rejected because it risks a visible flash and
  violates the hidden-label requirement.
- Retain measurements captured before hiding: rejected because typography or content may change
  while hidden and validity cannot be guaranteed without processing.

## Decision 7: Preserve transitions for placement, not text freshness

**Decision**: Set current text before measurement and apply the existing transition duration only to
placement and styling attributes where behavior already transitions. Interrupt or supersede stale
label transitions through the existing D3 update selection before applying current placement.

**Rationale**: This preserves animated chart updates while guaranteeing that measurement reflects
the new text. It also avoids an end-of-transition dependency that could fail when an update is
interrupted.

**Alternatives considered**:

- Remove all label transitions: rejected because transition behavior is part of the compatibility
  contract.
- Animate text replacement: rejected because text content is discrete and measuring intermediate old
  text is the reported correctness risk.

## Decision 8: Validate shared variants without silently adding a new feature

**Decision**: Add focused standard and grouped-bar coverage through the shared path. Before changing
stacked bars, characterize their current label behavior: their builder exposes labels, but
`StackedBarsComponent.drawBars()` assigns `stackedBarGroups` rather than the inherited `barGroups`
used by `drawLabels()`. If a supported stacked configuration reaches the shared label path, wire
only the appropriate existing group selection and add parity tests. Record any pre-existing
unsupported case rather than broadening stacked-label design or placement policy.

**Rationale**: The specification requires every grouped or stacked variant that currently uses the
shared behavior, while the code does not prove stacked labels are operational. A characterization
test prevents accidental scope expansion and makes the compatibility boundary explicit.

**Alternatives considered**:

- Assume inheritance proves stacked support: rejected because the required selection is not
  assigned.
- Exclude stacked bars without testing: rejected because the builder exposes labels and the spec
  explicitly requires relevant stacked behavior.
- Redesign stacked label placement: rejected as an unrelated new capability unless characterization
  demonstrates that current public behavior already requires the minimal wiring.

## Decision 9: Extend existing unit and component test seams

**Decision**: Add unit tests near `bars.component.spec.ts` for cache validity, formatting identity,
font generation, hidden bypass, and lifecycle cleanup. Add rendered component tests near
`bars-labels.cy.ts` for cold render, unchanged and changed strings, typography, resize/scale
changes, enter/exit/reorder, transitions, existing value categories, accessibility/visibility, and
grouped and characterized stacked variants. Spy on label `getBBox()` where needed to prove
measurement counts without using timing as an automated assertion. Characterize the existing
`component-test` target before feature edits: it currently references `demo-app:build:devleopment`.
If that spelling blocks the required command, correct only the target reference to the existing
`development` configuration and record the pre-existing failure.

**Rationale**: Call-count assertions deterministically prove reuse and selective invalidation.
Existing rendered tests already own positioning, color, resize, positive/negative/zero/no-value, and
inside/outside behavior, so extending them minimizes new harness code.

**Alternatives considered**:

- Assert performance thresholds in CI: rejected because shared-runner timing is noisy and does not
  replace controlled browser traces.
- Test only private cache helpers: rejected because update ordering and rendered text correctness
  require browser-rendered evidence.
- Add a new testing framework: rejected because Karma/Jasmine and Cypress already cover the needed
  levels.
- Ignore the malformed component-test target: rejected because the specification requires relevant
  Cypress tests to pass and the focused spelling correction is directly necessary to run that gate.

## Decision 10: Use a production demo and browser performance traces for evidence

**Decision**: Add a deterministic canonical demo scenario with approximately 50 visible labels and
controls for unchanged-text warm updates, changed-text updates, and resize or scale-only updates.
Build `demo-app` in production mode and serve its output consistently. On one documented browser and
hardware setup, collect at least 20 runs per scenario with browser performance recordings, using
named User Timing boundaries around each triggered update. Within those boundaries, record total
main-thread label-update duration, synchronous `Layout` duration, and long tasks. Repeat the exact
procedure after implementation and report medians, raw run values or trace references, environment,
and limitations.

**Rationale**: User Timing identifies each deterministic interaction while the browser trace exposes
layout work and long tasks. This provides browser-level evidence without adding a benchmark
dependency or treating local results as universal guarantees.

**Alternatives considered**:

- Use wall-clock logging alone: rejected because it cannot distinguish synchronous layout from other
  update work.
- Use CI timing as the primary benchmark: rejected because hardware contention prevents a controlled
  same-machine comparison.
- Add a new benchmark package: rejected because existing browser tooling is sufficient and a new
  dependency would violate the simplicity gate without demonstrated need.

## Decision 11: Preserve the public contract explicitly

**Decision**: Document a no-change contract for `@mathstack/viz`: existing bars, grouped-bars, and
applicable stacked-bars selectors; label builder methods; formatting hooks; display behavior;
selection observables; accessibility; visual placement; and transitions remain compatible. No new
exports, options, or required consumer actions are introduced.

**Rationale**: The optimization is internal, and compatibility is a constitutional gate.

**Alternatives considered**:

- Expose cache clearing or cache configuration: rejected because internal invalidation can satisfy
  all requirements transparently.
- Change formatter contracts to return dimensions: rejected because it burdens consumers and couples
  formatting to rendering internals.

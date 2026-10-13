# Data Model: Improve Bar Label Performance

This feature adds no persistent or consumer-visible data model. The following internal records
define measurement validity and reproducible evidence.

## RenderedLabelMeasurement

A dimension record owned weakly by one rendered SVG label element.

| Field                     | Type                       | Meaning                                                 |
| ------------------------- | -------------------------- | ------------------------------------------------------- |
| `renderedText`            | string                     | Exact text content measured on the current element.     |
| `typographyFingerprint`   | TypographyFingerprint      | Computed dimension-affecting style at measurement time. |
| `formatFunctionIdentity`  | function reference or null | Current custom formatter identity.                      |
| `formatSpecifier`         | string or null             | Current numeric format specifier.                       |
| `noValueFunctionIdentity` | function reference         | Current null/undefined/nonnumeric formatter identity.   |
| `fontGeneration`          | nonnegative integer        | Component generation when glyph metrics were measured.  |
| `width`                   | nonnegative number         | Rendered SVG text width.                                |
| `height`                  | nonnegative number         | Rendered SVG text height.                               |

### Identity and ownership

- The key is the `SVGTextElement` in a private `WeakMap`.
- A newly entered label has no record and MUST be measured.
- An exited label becomes unreachable and MUST NOT be retained by another strong collection.
- Reordering preserves a record only when the existing keyed parent and label element remain the
  same; record fields still MUST pass all validity checks.

### Validation rules

A record is reusable only when all of these values match the current render:

1. Rendered text.
2. Computed typography fingerprint.
3. Custom format function identity.
4. Numeric format specifier.
5. No-value function identity.
6. Font generation.

Bar value, chart size, scale, orientation, placement offset, and color are not measurement-validity
fields. They MUST always be evaluated from current geometry and configuration during placement.

## TypographyFingerprint

A stable serialization of computed styles that can change rendered text dimensions.

| Field group             | Included values                                                       |
| ----------------------- | --------------------------------------------------------------------- |
| Font selection          | family, size, weight, style, stretch, variant                         |
| Text spacing            | letter spacing, word spacing, line height                             |
| Text transformation     | text transform, writing mode                                          |
| Browser rendering hints | text rendering and other verified dimension-affecting computed values |

The implementation MUST compare normalized computed values, not stylesheet object identity.
Additional properties MAY be added when a focused test demonstrates that they affect dimensions.

## LabelPlacementContext

Current inputs used to position and style a label after dimensions are known.

| Field group  | Included values                                                         |
| ------------ | ----------------------------------------------------------------------- |
| Datum        | index, ordinal value, quantitative value, color value                   |
| Geometry     | current ranges, scales, bar dimensions, chart edge distance             |
| Policy       | orientation, offset, inside/outside rule, zero/no-value direction       |
| Presentation | configured colors, background color, display state, transition duration |

A placement context is evaluated on every draw and is never reused as a measurement record.

## LabelRenderFrame

The transient result of one phased label update.

| Field                | Meaning                                                           |
| -------------------- | ----------------------------------------------------------------- |
| `selection`          | Current joined label elements after enter/update/exit processing. |
| `visibleLabels`      | Labels eligible for measurement and placement.                    |
| `measurements`       | Current valid or newly read dimensions for each visible element.  |
| `transitionDuration` | Existing duration applied to placement-compatible writes.         |

### State transitions

```text
absent element
  -> entered + current text hidden
  -> measured
  -> placed + visible

measured element
  -> validity match -> reused -> placed from current geometry
  -> validity mismatch -> current text hidden -> remeasured -> placed + visible

visible element
  -> display disabled -> hidden without measurement
  -> exited -> removed; weak measurement becomes collectible

font generation N
  -> font readiness/loading completion
  -> generation N+1 + cache replacement
  -> current visible labels remeasured and replaced
```

## PerformanceScenario

A reproducible browser scenario used before and after implementation.

| Field         | Validation rule                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------- |
| Scenario name | One of initial render, unchanged-text warm update, changed-text update, resize/scale-only update. |
| Data          | Same approximately 50-bar dataset before and after.                                               |
| Environment   | Same browser/version, hardware, OS, viewport, production build, and throttling settings.          |
| Runs          | At least 20 measured runs per scenario.                                                           |
| Method        | Same User Timing boundaries and browser trace collection procedure.                               |

## PerformanceEvidenceSet

| Field                  | Meaning                                                                |
| ---------------------- | ---------------------------------------------------------------------- |
| `runs`                 | Raw values or trace references for every measured run.                 |
| `medianLabelDuration`  | Median main-thread label-update duration.                              |
| `medianLayoutDuration` | Median synchronous-layout duration within update boundaries.           |
| `longTasks`            | Count and duration of attributable tasks at least 50 ms.               |
| `environment`          | Browser, hardware, OS, build, data, viewport, and run count.           |
| `limitations`          | Measurement noise, tooling boundaries, and interpretation constraints. |
| `unverifiedRisks`      | Browser-specific behavior not measured.                                |

Baseline and post-change evidence MUST use identical scenario fields. Results describe only the
recorded environment and MUST NOT be generalized as consumer guarantees.

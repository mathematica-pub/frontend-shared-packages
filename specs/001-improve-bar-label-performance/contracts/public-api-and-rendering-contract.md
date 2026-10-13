# Public API and Rendering Contract

## Contract status

This feature is a backward-compatible internal optimization. It introduces no new export, selector,
input, output, builder method, configuration property, or required consumer action in
`@mathstack/viz`.

## Preserved consumer surface

The following existing surfaces remain compatible:

- Standard, grouped, and currently supported stacked bar component selectors and configuration
  builders.
- Existing label configuration for display, colors, offset, numeric formatting, custom formatting,
  and no-value output.
- Existing bar and label selection observables and interaction behavior.
- Existing chart configuration and update flows; consumers do not opt into measurement reuse.

## Rendering invariants

For the same data, configuration, chart dimensions, and loaded fonts, the completed feature MUST
preserve:

1. Exact rendered label text.
2. Horizontal and vertical placement, including inside-versus-outside policy.
3. Positive, negative, zero, null, undefined, and nonnumeric behavior.
4. Fill color and contrast behavior.
5. Display and visibility behavior without an incorrectly positioned flash.
6. Existing placement transitions and update timing visible to consumers.
7. Accessibility semantics and current interaction behavior.
8. Standard and grouped bar behavior plus every stacked configuration characterized as currently
   supported by the shared path.

The misspelled internal visibility style is corrected to the intended valid property. This is a bug
fix that restores intended hidden-during-placement behavior and does not authorize a visual
redesign.

## Internal measurement contract

A visible label may reuse dimensions only when its current rendered text, computed typography,
formatting identities, element identity, and font generation match its record. Placement is always
recalculated from current chart and bar geometry.

A label MUST be measured when it is new or any validity input changes. Text MUST be written before
measurement. All text writes precede geometry reads, and all geometry reads precede placement writes
for a render frame.

Hidden labels bypass geometry measurement. Exited labels leave no strongly retained measurement
state. Web-font availability changes invalidate earlier dimensions and trigger correction of current
visible labels.

## Variant compatibility gate

Grouped bars inherit and use the shared label path and MUST receive parity coverage. Stacked bars
expose label configuration but maintain a different group selection. Before implementation changes
that selection, a characterization test MUST determine whether an existing supported stacked
configuration reaches the shared contract.

- If supported behavior exists, implementation MAY add only the minimal selection wiring needed to
  preserve that behavior under the optimized path.
- If labels are currently unsupported or broken for stacked bars, the evidence MUST record that
  pre-existing boundary. This feature MUST NOT invent a new stacked-label placement policy.

## Evidence contract

Performance evidence MUST use approximately 50 visible labeled bars and cover initial rendering,
unchanged-text warm updates, changed-text updates, and resize or scale-only updates. Before and
after runs use the same browser, hardware, data, viewport, production build mode, run count of at
least 20, and trace method.

Acceptance requires at least a 50% reduction in median main-thread label-rendering and synchronous-
layout time for unchanged-text warm updates, valid measurement reuse, selective invalidation, no new
attributable task of 50 ms or greater, and no regression in the rendering invariants above.

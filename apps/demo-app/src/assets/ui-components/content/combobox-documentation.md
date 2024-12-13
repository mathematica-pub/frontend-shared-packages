# Combobox

## Overview

HSI UI Components provides a set of Angular components that can be composed to create comboboxes
with various functionalities.

The HSI UI Components combobox follows the
[W3C Combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/). When the W3C patterns do
not cover a functionality, we use the
[Angular Material Combobox](https://material.angular.io/components/combobox/overview) as a
reference.

A combobox is composed of the following components:

- ComboboxComponent
- TextboxComponent
- ListboxComponent
- ListboxComponentOption

Optional:

- ComboboxLabelComponent
- ListboxGroupComponent
- ListboxLabelComponent

We also have the following variants:

- EditableTextboxComponent
- NgFormEditableTextboxComponent
- NgFormListboxSingleComponent
- NgFormListboxMultiComponent

Currently the combobox component has no native icons, such as a box icon that indicates open status,
or checkboxes to use if the component is multi-select. Users can project their own icons in the
appropriate content projection slots.

## Combobox Component

A container component that contains a background div with a click event listener that appears when
the combobox is open, and a container div for the component.

Inputs: none

Outputs: none

EventListeners:

- `click`: on full-screen background div to listen for clicks outside the combobox. The combobox
  will close on click.'

Content Projection Slots:

- default: A slot for a ComboboxBox component and a Listbox component.
- `comboboxLabel`: For a label that describes the entire combobox component stack. Acceptable
  HTMLElements: `<span>`, none

## TextboxComponent

A component that serves as the visible button that opens the listbox, with a label which can be
static or dynamic. Contains listener for all keypress events for entire combobox, including listbox
and listbox options.

Inputs:

- `displaySelected: boolean`: Determines whether the selection value of the listbox is displayed as
  the Combobox box label. Will override user-specified label if true. Default value is `false`;

Outputs: none

EventListeners:

- `click`: handles click events
- `blur`: handles blue
- `keydown`: handles keypresses as described in W3C specifications

Content Projection Slots:

- `boxLabel`: Injects HTML for a static box label. Acceptable HTMLElements: any. Preferred HTML
  Elements: `<p>`.

### TextboxVariants

### EditableTextboxComponent

### NgFormEditableTextboxComponent

## ListboxComponent

A component that serves as a single- or multi-select selection interface, and appears when the
combobox is open.

Inputs:

- `maxHeight: number`: Controls the max-height property of the listbox panel, in px. Default value
  is 300.
- `isMultiSelect: boolean`: Determines whether the listbox can make one or more than one selection.
  Default is false, which creates a single-select listbox.
- `useListboxLabelAsBoxPlaceholder: boolean`: If true, any label projected into the `listboxLabel`
  slot will also be used as a displayed label in the box component when no selections are made. This
  will override any static label a user has projected as a `boxLabel` in the box component. Default
  to false.
- `findsOptionOnTyping: boolean`: Moves simulated focus to option that matches string that a user
  types. If listbox is closed, opens box and moves simulated focus. Replicates native `<select>`
  functionality. Default is true.

Outputs:

- `selected: (string | T) | (string | T)[]`: Event emitter that outputs selected item(s). Output is
  an array if `isMultiSelect` is `true`, else is a single object. If a user specifies a `value`
  input of type `T` on `ListboxOption`, output will be those values. Otherwise, output will be the
  `innerText` of the projected content in `ListboxOption`.

Content Projection Slots:

- `listboxLabel`: Injects HTML for a label that will appear at the top of the options list.
  Acceptable HTMLElements: any. Preferred HTMLElement: `<p>` (for a standard text label).
- `boxIcon`: A slot for an icon

### Listbox Variants

### NgFormListboxSingleComponent

A component that extends `ListboxComponent` and should be used in lieu of it to bind selected value
to an Angular `FormControl` when the listbox is single select.

Inputs:

- `maxHeight: number`: Controls the max-height property of the listbox panel, in px. Default value
  is 300.
- `useListboxLabelAsBoxPlaceholder: boolean`: If true, any label projected into the `listboxLabel`
  slot will also be used as a displayed label in the box component when no selections are made. This
  will override any static label a user has projected as a `boxLabel` in the box component. Default
  to false.
- `findsOptionOnTyping: boolean`: Moves simulated focus to option that matches string that a user
  types. If listbox is closed, opens box and moves simulated focus. Replicates native `<select>`
  functionality. Default is true.
- `control: FormControl<T>`: An Angular form control that will be updated with the selected value.

Outputs: none

Content Projection Slots: See `ListboxComponent`

### NgFormListboxMultiComponent

A component that extends `ListboxComponent` and should be used in lieu of it to bind selected values
to an Angular `FormControl` when the listbox is multi select.

Inputs:

- `maxHeight: number`: Controls the max-height property of the listbox panel, in px. Default value
  is 300.
- `useListboxLabelAsBoxPlaceholder: boolean`: If true, any label projected into the `listboxLabel`
  slot will also be used as a displayed label in the box component when no selections are made. This
  will override any static label a user has projected as a `boxLabel` in the box component. Default
  to false.
- `findsOptionOnTyping: boolean`: Moves simulated focus to option that matches string that a user
  types. If listbox is closed, opens box and moves simulated focus. Replicates native `<select>`
  functionality. Default is true.
- `control: FormArray<FormControl<boolean>>`: An Angular `FormArray` with one `FormControl` for each
  multi-select option.

Outputs: none

Content Projection Slots: See `ListboxComponent`

## ListboxOptionComponent

A component that creates a label/visual representation for an option in the listbox.

Inputs:

- `boxDisplayLabel: string`: Optional. A separate label to display as a selection in the box, when
  `ComboboxBoxComponent.displaySelected` is true. Use case: Option labels is the full name of a
  state, `boxDisplayLabel` is a state abbreviation. May be used on one or all options. If not
  present, the `innerText` of the projected content will be used. Updating this property dynamically
  will not trigger template updates.
- `value: T`: Optional. A value of any type that will be emitted through the
  `ListboxComponent.selected` event emitter as the selected value. If not present, the `innerText`
  of the projected content will be used. This property cannot be updated externally after component
  init.
- `selected: boolean`: Optional. A property that sets the selected status of the option. This
  property cannot be updated externally after component init.
- `disabled: boolean`: Optional. A property that sets the disabled status of the option. Updates
  will trigger template updates.

Outputs: none

Content Projection Slots:

- default: Injects HTML to use as the label for the option. Acceptable HTMLElements: any. Preferred
  HTMLElement: `<p>` (for a standard text label).
- `selectedIcon`: Optional. An icon that will be shown when the option is selected. Note that icons
  are independent of single/multi select state of listbox.
- `unselectedIcon`: Optional. An icon that will be shown when the option is not selected.

### ListboxGroupComponent

A component that can be projected into the `ListboxComponent`'s default projection slot to create a
labeled grouping of `ListboxOptions`. A `ListboxComponent` may contain multiple
`ListboxGroupComponents`, which is the intended use of the component. (It provides no value if only
one is used.) Each `ListboxGroupComponent` may contain one `ListboxLabel`, which will be placed
about the group's `ListboxOptions`. Using `ListboxGroup` to organize options has no effect on the
outputted selections, which will remain either a single value (for single-select) or a flat array
(for multi-select).

### ListboxLabelComponent

A component that can be used as a label within the listbox for the options. A label is not
selectable or focusable.

In an ungrouped context, this label could be useful for reminding users what they are selecting,
particularly if the box displays the selected value(s). It can also be used as a placeholder label
in the box if `Listbox.useListboxLabelAsBoxPlaceholder` is set to `true`.

Inside a `ListboxGroup`. the label will serve as a header for the group's options. In this use, it
cannot serve as placeholder text for the box.

Each `ListboxGroup` can have exactly one `ListboxLabel`, and each `ListboxComponent` can have
exactly one `ListboxLabel` outside of a `ListboxGroup`.

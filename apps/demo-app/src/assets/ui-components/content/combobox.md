# Combobox

HSI UI Components provides a set of Angular components that can be composed to create comboboxes
with various functionalities. These components can be imported via the `HsiUiComboboxModule`.

The HSI UI Components combobox follows the
[W3C Combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/). When the W3C patterns do
not cover a functionality (for example, multi-select), we use the
[Angular Material Combobox](https://material.angular.io/components/combobox/overview) as a
reference.

## Composing a Combobox

A combobox is minimally composed of the following components:

- `hsi-ui-combobox` &mdash; A component that is an outer wrapper for other components in the
  combobox.
- `hsi-ui-textbox` **or** `hsi-ui-editable-textbox` **or** `hsi-ui-ng-form-editable-textbox` &mdash;
  A component that is always visible, and can be used to open and close the listbox. Contains a
  label, or, if editable, an input into which the user can type.
- `hsi-ui-listbox` &mdash; A component that is hidden until the user interacts with the textbox.
  Contains the options that the user can select.
- `hsi-ui-listbox-option` &mdash; A component that creates an option in the listbox.

The following is a minimal implementation:

```custom-angular
minimal implementation
```

```html
<hsi-ui-combobox>
  <hsi-ui-textbox>
    <p boxLabel>Select a state</p>
    <span class="material-symbols-outlined expand-more" boxIcon> expand_more </span>
  </hsi-ui-textbox>
  <hsi-ui-listbox (valueChanges)="onSelection($event)">
    @for (option of options; track option) {
    <hsi-ui-listbox-option>{{ option }} </hsi-ui-listbox-option>
    }
  </hsi-ui-listbox>
</hsi-ui-combobox>
```

```ts
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HsiUiComboboxModule } from '@hsi/ui-components';

@Component({
  selector: 'app-my-combobox',
  standalone: true,
  imports: [CommonModule, HsiUiComboboxModule],
  templateUrl: './my-combobox.component.html',
  styleUrl: './my-combobox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyComboboxComponent {
  options: string[] = [
    'Connecticut',
    'Maine',
    'Massachusetts',
    'New Hampshire',
    'Rhode Island',
    'Vermont',
  ];

  onSelection(selected: string): void {
    // do something with the value of the combobox
  }
}
```

## Features

Users can configure comboboxes with a number of features to suit their specific needs.

### Single / Multi Select

Comboboxes can be single-select or multi-select. The default is single-select. To enable
multi-select, set the `isMultiSelect` input to `true` on the `hsi-ui-listbox`.

```custom-angular
multi-select example
```

```html
<hsi-ui-listbox [isMultiSelect]="true" (valueChanges)="onSelection($event)">
  @for (option of options; track option.id) {
  <hsi-ui-listbox-option>{{ option.displayName }} </hsi-ui-listbox-option>
  }
</hsi-ui-listbox>
```

If the combobox is multi-select, the `valueChanges` event will be an array of selected values. If
single-select, it will be a single value.

#### Select all

If the combobox is multi-select, users can include a "Select All" option by incorporating the
`hsi-ui-select-all-listbox-option` into the listbox.

"Select All" will select all options in the listbox when it is selected and deselect all options
when it is deselected.

```custom-angular
select all example
```

```html
<hsi-ui-listbox [isMultiSelect]="true" (valueChanges)="onSelection($event)">
  <hsi-ui-select-all-listbox-option>Select all</hsi-ui-select-all-listbox-option>
  @for (option of options; track option.id) {
  <hsi-ui-listbox-option>{{ option.displayName }} </hsi-ui-listbox-option>
  }
</hsi-ui-listbox>
```

It is not possible to set `selected` and `disabled` inputs of the "Select All" option externally.

### Emitting Selected Values

The value of the combobox will be the `value` of the selected `hsi-ui-listbox-option`. If the
combobox is multi-select, the value will be an array of the `value`s of each selected option.

A user can set the `value` of a `hsi-ui-listbox-option` to any value they choose through that
component's `value` input. If no value is provided, the `hsi-ui-listbox-option` will use its label
as its value.

By default, the comboxbox emits its value through the `valueChanges` event on the `hsi-ui-listbox`.
Values are emitted only when the user selects or deselects an option.

#### Using the combobox with Angular Forms

Users may also provide an Angular `FormControl` to the listbox to manage the selected values, via
the `formControl` input on the `hsi-ui-listbox`.

If a form control is provided, the combobox will not emit values through the `valueChanges` event.
Instead, users can subscribe to the form control's `valueChanges` observable to get the selected
values.

```html
<hsi-ui-listbox [isMultiSelect]="true" [formControl]="myFormControl">
  @for (option of options; track option.id) {
  <hsi-ui-listbox-option>{{ option.displayName }}</hsi-ui-listbox-option>
  }
</hsi-ui-listbox>
```

If the combobox is single-select, the `formControl` should be of type `FormControl<any>`. If it is
multi-select, the `formControl` should be of type `FormControl<any[]>`.

### Customizing the Textbox Label

#### Displaying selected options

By default, the textbox portion of the combobox will display the label(s) of the selected options in
the textbox once a selection has been made.

Before any selection is made, the textbox will display any label projected into the textbox that
uses the `boxLabel` directive.

In order to use a different values in the textbox to represent the label -- for example, to use a
two letter state abbrevation when the option displays the full state name -- a value for the textbox
label can be provided via each `hsi-listbox-option`'s `boxDisplayLabel` input.

The textbox offers three additional label options, beyond the default dynamic label: a static label,
a label that displays the number of selected options, and completely customizabile label. The latter
two of these will have no effect when `dynamicLabel` is set to `false`.

#### Displaying a static label

If the `dynamicLabel` input property on the `hsi-ui-textbox` is set to `false`, the label with the
`boxLabel` directive will be displayed in the textbox at all times.

```custom-angular
static label example
```

```html
<hsi-ui-textbox [dynamicLabel]="false">
  <p boxLabel>Select states</p>
  <span class="material-symbols-outlined expand-more" boxIcon> expand_more </span>
</hsi-ui-textbox>
```

#### Displaying the number of selected options

The textbox will display the number of selected options rather than the names of the selected
options if the `showSelectedCount` input on the `hsi-ui-textbox` is defined. The value of this input
should be of type `{singular: string, plural: string}`, where the strings are the singular and
plural forms of the word that will be displayed in the textbox. If the textbox should read, "1 item
selected" / "2 items selected", the input should be `{singular: 'item', plural: 'items'}`.

```custom-angular
count selected example
```

```html
<hsi-ui-textbox [showSelectedCount]="{singular: 'state', plural: 'states'}">
  <p boxLabel>Select states</p>
  <span class="material-symbols-outlined expand-more" boxIcon> expand_more </span>
</hsi-ui-textbox>
```

#### Providing a custom label

For a completely custom label, users can set the `customLabel` input to a function with the type
signature
`(selectedOptions: ListboxOptionComponent[], showSelectedCount?: CountSelectedLabel) => string` that
should return the string to be displayed in the textbox. The function will be called whenever the
selected options change.

```custom-angular
custom label example
```

```html
<hsi-ui-textbox [customLabel]="customLabel">
  <p boxLabel>Select states</p>
  <span class="material-symbols-outlined expand-more" boxIcon> expand_more </span>
</hsi-ui-textbox>
```

```ts
// an example custom label function
customLabel(selectedOptions: ListboxOptionComponent[]): string {
    if (selectedOptions.length === 0) {
      return 'No states selected';
    }
    return `${selectedOptions.length} states selected (${selectedOptions.map((option) => option.valueToEmit).join(', ')})`;
}
```

### Grouping Options

Listbox options can be organized into groups using the `hsi-ui-listbox-group` component. To add a
label to a group, the `hsi-ui-listbox-label` can be used.

Select all options (optional) can only be placed inside of a group, and will only operate on options
within that group.

```custom-angular
grouped example
```

```html
<hsi-ui-listbox [isMultiSelect]="isMultiSelect" (valueChanges)="onSelection($event)">
  <hsi-ui-listbox-group>
    <hsi-ui-listbox-label>New England states</hsi-ui-listbox-label>
    <hsi-ui-select-all-listbox-option>Select all</hsi-ui-select-all-listbox-option> // optional @for
    (option of newEnglandOptions; track option.id) {
    <hsi-ui-listbox-option>{{ option.displayName }} </hsi-ui-listbox-option>
    }
  </hsi-ui-listbox-group>
  <hsi-ui-listbox-group>
    <hsi-ui-listbox-label>Mid-Atlantic states</hsi-ui-listbox-label>
    <hsi-ui-select-all-listbox-option>Select all</hsi-ui-select-all-listbox-option> // optional @for
    (option of midAtlanticOptions; track option.id) {
    <hsi-ui-listbox-option>{{ option.displayName }} </hsi-ui-listbox-option>
    }
  </hsi-ui-listbox-group>
</hsi-ui-listbox>
```

### Filtering Options

To search or filter options, users can use an `hsi-ui-editable-textbox` in place of the
`hsi-ui-textbox`.

These textboxes will emit the value of the input field through the `valueChanges` event. Users can
then filter the options in the listbox based on this value.

```custom-angular
filterable example
```

```html
<hsi-ui-combobox>
  <hsi-ui-editable-textbox
    placeholder="Select a state"
    (valueChanges)="onTyping($event)"
  ></hsi-ui-editable-textbox>
  <hsi-ui-listbox>
    @for (option of options$ | async; track option) {
    <hsi-ui-listbox-option>{{ option }}</hsi-ui-listbox-option>
    }
  </hsi-ui-listbox>
</hsi-ui-combobox>
```

```ts
_options: string[] = [
  'Connecticut',
  'Maine',
  'Massachusetts',
  'New Hampshire',
  'Rhode Island',
  'Vermont',
];
options: BehaviorSubject<{ displayName: string; id: string }[]> =
  new BehaviorSubject(this._options);
options$ = this.options.asObservable();

onTyping(value: string): void {
  const filteredOptions = this._options.filter((option) =>
      //user-supplied filtering logic
      option.toLowerCase().includes(value.toLowerCase())
    )
  this.options.next(filteredOptions);
}
```

#### Using an Editable Textbox with Angular Forms

Users may also provide an Angular `FormControl` to the `hsi-ui-editable-textbox` to manage the value
of the texbox `input`.

If a form control is provided, the textbox will not emit values through the `valueChanges` event.
Instead, users can subscribe to the form control's `valueChanges` observable to get the selected
values.

```html
<hsi-ui-editable-textbox
  placeholder="Select a state"
  (formControl)="myFormControl"
></hsi-ui-editable-textbox>
```

### Setting Listbox Option Properties Externally

The `selected` and `disabled` properties of an `hsi-ui-listbox-option` can be set from outside of
the combobox. This can be useful for setting the selected options based on an external source, or
for disabling options based on some condition.

Note that if the value of the `selected` property changes externally, the combobox will not emit the
new value through the `valueChanges` event, nor will a provided FormControl receive a new value.

```custom-angular
external selection example
```

```html
<hsi-ui-combobox>
  <hsi-ui-textbox>
    <p boxLabel>Select states</p>
    <span class="material-symbols-outlined expand-more" boxIcon>
      expand_more
    </span>
  </hsi-ui-textbox>
  <hsi-ui-listbox [isMultiSelect]="true" (valueChanges)="onSelection($event)">
    <hsi-ui-select-all-listbox-option
      >Select all</hsi-ui-select-all-listbox-option
    >
    @for (option of options; track option.id) {
      <hsi-ui-listbox-option
        [selected]="(selected$ | async).includes(option.id)" // example implementation
        [disabled]="(disabled$ | async).includes(option.id)" // example implementation
      >
        {{ option.displayName }}
      </hsi-ui-listbox-option>
    }
  </hsi-ui-listbox>
</hsi-ui-combobox>
```

### Providing an External Label for the Combobox

Users may want to provide a label outside of the combobox component. This can be done by projecting
text into the the `hsi-ui-combobox-label` component, which ensures that this label is correctly
identified as the combobox's label by screen readers.

```custom-angular
combobox label example
```

```html
<hsi-ui-combobox>
  <hsi-ui-combobox-label>Select New England states to view data</hsi-ui-combobox-label>
  // other combobox components
</hsi-ui-combobox>
```

### Styling

The combobox comes with basic css styling. The majority of styling options are set with CSS
variables that are injected at the root level of the application. If you are using `hsi-adk` color
themes, the combobox will automatically inherit the colors from the theme.

Users can provide new values for these variables to customize the appearance of the combobox.

```html
<hsi-ui-combobox class="my-combobox"> ... </hsi-ui-combobox>
```

```scss
.my-combobox {
  --hsi-adk-combobox-border-radius: 0; // default is 0.5rem;
}
```

### Icons

To minimize dependencies, the combobox does not include any icons. Users can project their own icons
into provided slots.

To provide an icon to indicate the open status of the combobox, project an icon into the `boxIcon`
slot of the `hsi-ui-textbox`.

To provide an icon to indicate the selected status of a listbox option, project an icons into the
`selectedIcon` and `unselectedIcon` slots of the `hsi-ui-listbox-option`.

```custom-angular
icons example
```

```html
<hsi-ui-combobox>
  <hsi-ui-textbox>
    <p boxLabel>Select a state</p>
    <span class="material-symbols-outlined expand-more" boxIcon> expand_more </span>
  </hsi-ui-textbox>
  <hsi-ui-listbox [isMultiSelect]="true" (valueChanges)="onSelection($event)">
    <hsi-ui-select-all-listbox-option>
      <span class="material-symbols-outlined icon checkbox" selectedIcon> check_box </span>
      <span unselectedIcon class="material-symbols-outlined icon checkbox">
        check_box_outline_blank
      </span>
      Select all</hsi-ui-select-all-listbox-option
    >
    @for (option of options; track option) {
    <hsi-ui-listbox-option
      ><span class="material-symbols-outlined icon checkbox" selectedIcon> check_box </span
      ><span unselectedIcon class="material-symbols-outlined icon checkbox">
        check_box_outline_blank </span
      >{{ option }}
    </hsi-ui-listbox-option>
    }
  </hsi-ui-listbox>
</hsi-ui-combobox>
```

# Filtering Combobox Options

Using the `hsi-ui-editable-textbox` component in lieu of the `hsi-ui-editable-textbox` in a combobox
allows users to filter combobox options by typing in a text input.

To maximize flexibility in how the combobox options are filtered, the `hsi-ui-editable-textbox`
component will emit the text of the text input through the `valueChages` output, rather than
internally filtering options. As a user, you will need to use this value to create a filtered set of
options for the combobox.

Users must also provide an expression for the `selected` property of each `hsi-ui-listbox-option` in
order to retain selections as options are filtered.

Note that the `hsi-ui-editable-textbox` will not recognize a provided `boxLabel`. If a label is
desired in the textbox before user text is provided, this label should be passed to the
`placeholder` property.

## Single / Multi Select with an Editable Textbox

The single- and multi-select versions of the filterable combobox have slightly different behaviors
and will require you to filter options and set `selected` properties in different ways in the
consuming component.

The examples below provide suggested implementations for filtering options and setting `selected`
properties on the options.

You can optionally provide a `clearOnClick` input to the editable textbox which will clear its
displayed text on click, so that the user sees all options when they click back into the combobox.

### Single Select

A single-select listbox with an editable textbox will set the display label of the selected option
as the value of the textbox when a selection is made.

As a result, when a new selection is made in the listbox, the options should be filtered to just the
selected option. Once the textbox value is changed, the options should be filtered based on the
textbox value.

```custom-angular
single select filterable example
```

```html
@if (vm$ | async; as vm) {
<hsi-ui-combobox>
  <hsi-ui-editable-textbox
    placeholder="Select a state"
    (valueChanges)="onTextboxChange($event)"
  ></hsi-ui-editable-textbox>
  <hsi-ui-listbox (valueChanges)="onSelection($event)">
    @for (option of vm.options; track option) {
    <hsi-ui-listbox-option [selected]="option.displayName === vm.selected"
      >{{ option }}</hsi-ui-listbox-option
    >
    }
  </hsi-ui-listbox>
</hsi-ui-combobox>
}
```

```ts
interface ViewModel {
  options: string[];
  selected: string;
}

options: string[] = [
  'Connecticut',
  'Maine',
  'Massachusetts',
  'New Hampshire',
  'Rhode Island',
  'Vermont',
];
// example of storing value locally in the component; value may also be stored in higher level state
listboxValue = new BehaviorSubject<string>(null);
listboxValue$ = this.listboxValue.asObservable();
textboxValue: BehaviorSubject<string> = new BehaviorSubject('');
textboxValue$ = this.comboboxValue.asObservable();
vm$: Observable<ViewModel>;

ngOnInit(): void {
  this.vm$ = combineLatest([this.listboxValue$, this.textboxValue$]).pipe(
    map(([listboxValue, textboxValue]) => this.getViewModel(listboxValue, textboxValue)),
    shareReplay(1)
  );
}

getViewModel(listboxValue: string, textboxValue: string): ViewModel {
  const selected = this._options.find((x) => x === listboxValue);
  const filteredOptions = this._options.filter((option) => {
    // if an option is selected, show only that option, covers cases where there may be multiple options that match the textbox value
    // e.g. selected option is Kevin Ng and there is another option, Kevin Nguyen
    if (selected && textboxValue === selected) {
      return option === listboxValue;
    } else {
      return this.optionIncludesSearchText(option, textboxValue);
    }
  });
  return { options: filteredOptions, selected: listboxValue};
}

optionIncludesSearchText(
  option: string,
  value: string
): boolean {
  return option.toLowerCase().includes(value?.toLowerCase());
}

onTextboxChange(value: string): void {
  this.textboxValue.next(value);
}

onSelection(selected: string): void {
  this.listboxValue.next(selected);
}
```

### Multi Select

A multi-select listbox with an editable textbox will clear the value of the textbox input when a
selection is made. As a result, when a new selection is made in the listbox, all options should be
displayed. Once the textbox value is changed, the options should be filtered based on the textbox
value.

Note that for a multi-select version, it is recommended to create separate `filteredOptions$` and
`selected$` observables to hold those values rather than a combined view model. In this case,
`selected$` value should be subscribed to in the template outside of the `@for` loops that creates
the options/where the value of `selected$` is used.

```custom-angular
multi select filterable example
```

```html
<hsi-ui-combobox>
  <hsi-ui-editable-textbox
    [placeholder]="'Select states'"
    (valueChanges)="onTextboxChange($event)"
  ></hsi-ui-editable-textbox>
  <hsi-ui-listbox (valueChanges)="onSelection($event)" [isMultiSelect]="true">
    @if (selected$ | async; as selected) { @for (option of filteredOptions$ | async; track
    option.id) {
    <hsi-ui-listbox-option [value]="option.id" [selected]="selected.includes(option.id)"
      >{{ option.displayName }}</hsi-ui-listbox-option
    >
    } }
  </hsi-ui-listbox>
</hsi-ui-combobox>
```

```ts
options: string[] = [
  'Connecticut',
  'Maine',
  'Massachusetts',
  'New Hampshire',
  'Rhode Island',
  'Vermont',
];
// example of storing value locally in the component; value may also be stored in higher level state
listboxValue = new BehaviorSubject<string[]>(null);
listboxValue$ = this.listboxValue.asObservable();
textboxValue: BehaviorSubject<string> = new BehaviorSubject<string>('');
textboxValue$ = this.comboboxValue.asObservable();
filteredOptions$: Observable<{ displayName: string; id: string }[]>;
selected$: Observable<string[]>;

ngOnInit(): void {
  this.filteredOptions$ = this.textboxValue$.pipe(
    map((textboxValue) =>
      this.getOptions(textboxValue)
    ),
    shareReplay(1)
  );

  this.selected$ = this.listboxValue$.pipe(
    withLatestFrom(this.filteredOptions$),
    scan(
      (prevSelected, [listboxValue, filteredOptions]) =>
        this.getSelected(
          prevSelected,
          listboxValue,
          filteredOptions,
        ),
      ([] as string[]) // initial value of the listbox
    ),
    shareReplay(1)
  );
}

getOptions(inputValue: string): { displayName: string; id: string }[] {
  return this.options.filter((option) => {
    if (inputValue === '') {
      return true;
    } else {
      return this.optionIncludesSearchText(option, inputValue);
    }
  });
}

optionIncludesSearchText(
  option: string,
  value: string
): boolean {
  return option.toLowerCase().includes(value?.toLowerCase());
}

getSelected(
  prevSelected: string[],
  listboxValue: string[],
  filteredOptions: { displayName: string; id: string }[],
): string[] {
  const prevSelectedNotInOptions = prevSelected.filter(
    (x) => !filteredOptions.some((o) => o.id === x)
  );
  if (prevSelectedNotInOptions.length) {
    return [...listboxValue, ...prevSelectedNotInOptions];
  }
  return listboxValue;
}

onTextboxChange(value: string[]): void {
  this.textboxValue.next(value);
}

onSelection(selected: string): void {
  this.listboxValue.next(selected);
}
```

## Using an Angular Form Control with an Editable Textbox

Users may also provide an Angular `FormControl` to the `hsi-ui-editable-textbox` `ngFormControl`
input property to manage the value of the textbox `input`.

If a form control is provided, the textbox will not emit values through the `valueChanges` event.
Instead, users can subscribe to the form control's `valueChanges` observable to get the selected
values.

Users may also use a `FormControl` to manage the value of the listbox, as described in the Combobox
documentation.

```html
<hsi-ui-editable-textbox
  placeholder="Select a state"
  [ngFormControl]="myFormControl"
></hsi-ui-editable-textbox>
```

When setting an options Observable or a view model Observable in your consuming component, you
should use use the `startWith` operator to ensure that the options are displayed when the component
is first rendered.

```ts
this.vm$ = combineLatest([
  this.listboxFormControl.valueChanges.pipe(startWith('')),
  this.textboxFormControl.valueChanges.pipe(startWith('')),
]).pipe((
  map(([listboxValue, textboxValue]) => this.getViewModel(listboxValue, textboxValue))
);
```

## Providing an Initial Value

### Initializing a Value in the Textbox

If you want to provide an initial value to the textbox, you can do so by providing a value to the
`initialValue` property if you are using the `valueChanges` event emitter or by providing a value to
the `ngFormControl` if you are using a form control.

It is suggested to provide an initial value to the editable textbox _if your listbox is single
select_ and if one of your options will be selected on initialization.

```html
<hsi-ui-editable-textbox
  placeholder="Select a state"
  [initialValue]="Massachusetts"
  (valueChanges)="onTextboxChange($event)"
></hsi-ui-editable-textbox>
```

#### Using the `valueChanges` event emitter

```ts
textboxValue: BehaviorSubject<string> = new BehaviorSubject<string>('Massachusetts');
textboxValue$ = this.comboboxValue.asObservable();
```

#### Using a Form Control

```ts
textboxFormControl = new FormControl('Massachusetts');
```

### Initializing a Value / Values in the Listbox

To set one or more of the `hsi-ui-listbox-option`s as selected on initialization, you will need to
ensure that this is reflected in the initial calculation of the `selected` property expression on
each option.

In the code examples below, all options will be shown in the listbox when the user first interacts
with it, even if a value is displayed in the textbox. Once the user types in the textbox, the
options will be filtered based on the value of the textbox.

#### Single-select using the `valueChanges` event emitter

```custom-angular
single select value changes filtered options initial value
```

```ts
listboxValue = new BehaviorSubject<string>('Massachusetts'); // value should be the value of the selected option
listboxValue$ = this.listboxValue.asObservable();
textboxValue: BehaviorSubject<string> = new BehaviorSubject<string>('Massachusetts'); // value should be the label of the selected option
textboxValue$ = this.comboboxValue.asObservable();
vm$: Observable<ViewModel>;

ngOnInit(): void {
  this.vm$ = combineLatest([this.listboxValue$, this.inputValue$]).pipe(
    map(([listboxValue, inputValue], index) =>
      this.getViewModel(
        listboxValue as string,
        inputValue as string,
        index === 0
      )
    )
  );
}

getViewModel(
  listboxValue: string,
  inputValue: string,
  isInit: boolean
): ViewModel {
  const selected = this.options.find((x) => x.id === listboxValue);
  const filteredOptions = this.options.filter((option) => {
    if (isInit) return true;
    // if an option is selected, show only that option, covers cases where there may be multiple options that match the textbox value
    // e.g. selected option is Kevin Ng and there is another option, Kevin Nguyen
    if (selected && inputValue === selected.displayName) {
      return option.id === listboxValue;
    }
    return this.optionIncludesSearchText(option, inputValue);
  });
  return {
    options: filteredOptions,
    selected: listboxValue,
  };
}

optionIncludesSearchText(
  option: { displayName: string; id: string },
  value: string
): boolean {
  // same as in above examples
}
```

#### Single-select using a form control

```custom-angular
single select form control filtered options initial value
```

```ts
inputFormControl: FormControl<string> = new FormControl<string>('Massachusetts');
listboxFormControl: FormControl<string> = new FormControl<string>('');
vm$: Observable<ViewModel>;

ngOnInit(): void {
  this.vm$ = combineLatest([
    this.listboxFormControl.valueChanges.pipe(
      startWith('Massachusetts')
    ),
    this.inputFormControl.valueChanges.pipe(startWith('')),
  ]).pipe(
    map(([listboxValue, inputValue], index) =>
      this.getViewModel(
        listboxValue as string,
        inputValue as string,
        index === 0
      )
    )
  );
}

getViewModel(
  listboxValue: string,
  inputValue: string,
  isInit: boolean
): FilterableOptionsViewModel {
  // same as in above example
}
```

#### Multi-select using the `valueChanges` event emitter

Note that an `hsi-ui-editable-textbox` should not have an initial value when the listbox is
multi-select since the value of the textbox will be cleared when the user selects an option.

```custom-angular
multi select value changes filtered options initial value
```

```ts
initialSelections = ['Maine', 'Massachusetts']; // an array of the values of the selected options
inputValue = new BehaviorSubject<string>('');
inputValue$ = this.inputValue.asObservable();
listboxValue = new BehaviorSubject<string[]>([]);
listboxValue$ = this.listboxValue.asObservable();
filteredOptions$: Observable<{ displayName: string; id: string }[]>;
selected$: Observable<string[]>;

ngOnInit(): void {
  this.filteredOptions$ = this.inputValue$.pipe(
    map((inputValue, index) =>
      this.getOptions(index === 0 ? '' : inputValue) // ensures that all options are shown when the component is first rendered
    ),
    shareReplay(1)
  );

  this.selected$ = this.listboxValue$.pipe(
    withLatestFrom(this.filteredOptions$),
    scan(
      (prevSelected, [listboxValue, filteredOptions], index) =>
        this.getSelected(
          prevSelected,
          listboxValue,
          filteredOptions,
          index === 0
        ),
      this.initialSelections // initial value of the listbox
    ),
    shareReplay(1)
  );
}

getOptions(inputValue: string): { displayName: string; id: string }[] {
  return this.options.filter((option) => {
    if (inputValue === '') {
      return true;
    } else {
      return this.optionIncludesSearchText(option, inputValue);
    }
  });
}

getSelected(
  prevSelected: string[],
  listboxValue: string[],
  filteredOptions: { displayName: string; id: string }[],
  prevSelectedIsInitValue: boolean
): string[] {
  if (prevSelectedIsInitValue) {
    return prevSelected;
  }
  const prevSelectedNotInOptions = prevSelected.filter(
    (x) => !filteredOptions.some((o) => o.id === x)
  );
  if (prevSelectedNotInOptions.length) {
    return [...listboxValue, ...prevSelectedNotInOptions];
  }
  return listboxValue;
}
```

#### Multi-select using a Form Control

```custom-angular
multi select form control filtered options initial value
```

```ts
initialSelections = ['Maine', 'Massachusetts']; // an array of the values of the selected options
inputFormControl: FormControl<string> = new FormControl<string>('');
listboxFormControl: FormControl<string[]> = new FormControl<string[]>([]);
filteredOptions$: Observable<{ displayName: string; id: string }[]>;
selected$: Observable<string[]>;

ngOnInit(): void {
  const listboxValue$ = this.listboxFormControl.valueChanges.pipe(
    startWith([] as string[])
  );

  const inputValue$ = this.inputFormControl.valueChanges.pipe(startWith(''));

  this.filteredOptions$ = inputValue$.pipe(
    map((inputValue) => this.getOptions(inputValue)),
    shareReplay(1)
  );

  this.selected$ = listboxValue$.pipe(
    withLatestFrom(this.filteredOptions$),
    scan(
      (prevSelected, [listboxValue, filteredOptions], index) =>
        this.getSelected(
          prevSelected,
          listboxValue,
          filteredOptions,
          index === 0
        ),
      this.initialSelections // initial value of the listbox
    ),
    shareReplay(1)
  );
}

getOptions(inputValue: string): { displayName: string; id: string }[] {
  // same as in above example
}

getSelected(
  prevSelected: string[],
  listboxValue: string[],
  filteredOptions: { displayName: string; id: string }[],
  prevSelectedIsInitValue: boolean
): string[] {
  // same as in above example
}
```

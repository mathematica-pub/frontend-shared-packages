import { Directive } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FilterableOptions } from './filterable-options';

@Directive()
export abstract class FilterableOptionsFormControl extends FilterableOptions {
  inputFormControl: FormControl<string>;

  initInputControl(initialValue: string = ''): void {
    this.inputFormControl = new FormControl<string>(initialValue);
  }
}

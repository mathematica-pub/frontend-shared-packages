import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HsiUiComboboxModule } from '@hsi/ui-components';
import { combineLatest, map, startWith } from 'rxjs';
import { FilterableOptionsSingle } from '../filterable-options-single';

@Component({
  selector: 'app-filterable-options-single-select-form-control-combobox',
  standalone: true,
  imports: [CommonModule, HsiUiComboboxModule],
  templateUrl: './filterable-options-single-form-control.component.html',
  styleUrl: './filterable-options-single-form-control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterableOptionsSingleSelectFormControlComboboxComponent
  extends FilterableOptionsSingle
  implements OnInit
{
  inputFormControl: FormControl<string>;
  listboxFormControl: FormControl<string> = new FormControl<string>('');

  init(): void {
    if (this.hasInitialValue) {
      this.initialValue = this.options[2];
    }
    this.initInputControl();

    this.vm$ = combineLatest([
      this.listboxFormControl.valueChanges.pipe(
        startWith(this.initialValue?.id || '')
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

  initInputControl(): void {
    this.inputFormControl = new FormControl<string>(
      this.initialValue ? this.initialValue.displayName : ''
    );
  }
}

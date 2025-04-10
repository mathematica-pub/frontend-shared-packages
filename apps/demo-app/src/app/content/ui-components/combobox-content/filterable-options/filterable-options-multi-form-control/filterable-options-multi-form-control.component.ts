import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HsiUiComboboxModule } from '@hsi/ui-components';
import { map, scan, shareReplay, startWith, withLatestFrom } from 'rxjs';
import { FilterableOptionsMulti } from '../filterable-options-multi';

@Component({
  selector: 'app-filterable-options-multi-select-form-control-combobox',
  imports: [CommonModule, HsiUiComboboxModule],
  templateUrl: './filterable-options-multi-form-control.component.html',
  styleUrl: './filterable-options-multi-form-control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterableOptionsMultiSelectFormControlComboboxComponent
  extends FilterableOptionsMulti
  implements OnInit
{
  inputFormControl: FormControl<string> = new FormControl<string>('');
  listboxFormControl: FormControl<string[]> = new FormControl<string[]>([]);

  init(): void {
    if (this.hasInitialValue) {
      this.initialValue = [this.options[1], this.options[2]];
    }
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
        this.initialValue
          ? this.initialValue.map((x) => x.id)
          : ([] as string[])
      ),
      shareReplay(1)
    );
  }
}

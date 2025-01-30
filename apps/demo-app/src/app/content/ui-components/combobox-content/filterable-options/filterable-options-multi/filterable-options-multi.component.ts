import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HsiUiComboboxModule } from '@hsi/ui-components';
import { BehaviorSubject, map, scan, shareReplay, withLatestFrom } from 'rxjs';
import { FilterableOptionsMulti } from '../filterable-options-multi';

@Component({
  selector: 'app-filterable-options-multi-select-combobox',
  standalone: true,
  imports: [CommonModule, HsiUiComboboxModule],
  templateUrl: './filterable-options-multi.component.html',
  styleUrl: './filterable-options-multi.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterableOptionsMultiSelectComboboxComponent
  extends FilterableOptionsMulti
  implements OnInit
{
  inputValue = new BehaviorSubject<string>('');
  inputValue$ = this.inputValue.asObservable();
  listboxValue = new BehaviorSubject<string[]>([]);
  listboxValue$ = this.listboxValue.asObservable();

  init(): void {
    if (this.hasInitialValue) {
      this.initialValue = [this.options[1], this.options[2]];
    }

    this.filteredOptions$ = this.inputValue$.pipe(
      map((inputValue, index) =>
        this.getOptions(index === 0 ? '' : inputValue)
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
        this.initialValue
          ? this.initialValue.map((x) => x.id)
          : ([] as string[])
      ),
      shareReplay(1)
    );
  }

  onTyping(value: string): void {
    this.inputValue.next(value);
  }

  onSelection(value: string[]): void {
    this.listboxValue.next(value);
  }
}

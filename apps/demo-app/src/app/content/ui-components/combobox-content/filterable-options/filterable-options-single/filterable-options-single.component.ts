import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HsiUiComboboxModule } from '@hsi/ui-components';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { FilterableOptionsSingle } from '../filterable-options-single';

@Component({
  selector: 'app-filterable-options-single-select-combobox',
  imports: [CommonModule, HsiUiComboboxModule],
  templateUrl: './filterable-options-single.component.html',
  styleUrl: './filterable-options-single.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterableOptionsSingleSelectComboboxComponent
  extends FilterableOptionsSingle
  implements OnInit
{
  inputValue = new BehaviorSubject<string>('');
  inputValue$ = this.inputValue.asObservable();
  listboxValue = new BehaviorSubject<string>(null);
  listboxValue$ = this.listboxValue.asObservable();

  init(): void {
    if (this.hasInitialValue) {
      this.initialValue = this.options[2];
    }
    this.initInputValue();
    this.initListboxValue();

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

  initInputValue(): void {
    this.inputValue.next(
      this.initialValue ? this.initialValue.displayName : ''
    );
  }

  initListboxValue(): void {
    this.listboxValue.next(this.initialValue ? this.initialValue.id : null);
  }

  onSelection(value: string): void {
    this.listboxValue.next(value);
  }

  onTyping(value: string): void {
    this.inputValue.next(value);
  }
}

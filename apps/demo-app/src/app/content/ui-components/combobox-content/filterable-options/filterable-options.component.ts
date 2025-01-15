import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { HsiUiComboboxModule } from '@hsi/ui-components';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  startWith,
} from 'rxjs';

interface ViewModel<ListboxSelection> {
  options: { displayName: string; id: string }[];
  selected: ListboxSelection;
}

@Component({
  selector: 'app-filterable-options-combobox',
  standalone: true,
  imports: [CommonModule, HsiUiComboboxModule],
  templateUrl: './filterable-options.component.html',
  styleUrl: './filterable-options.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterableOptionsComboboxComponent implements OnInit {
  @Input() useFormControl = true;
  @Input() isMulti = true;
  _options: { displayName: string; id: string }[] = [
    { displayName: 'Connecticut', id: 'CT' },
    { displayName: 'Maine', id: 'ME' },
    { displayName: 'Massachusetts', id: 'MA' },
    { displayName: 'New Hampshire', id: 'NH' },
    { displayName: 'Rhode Island', id: 'RI' },
    { displayName: 'Vermont', id: 'VT' },
  ];
  fcOptions$: Observable<{ displayName: string; id: string }[]>;
  initialValue = this._options[2].displayName;
  listboxFormControl: FormControl<string | string[]>;
  searchFormControl = new FormControl<string>('');
  listboxValue = new BehaviorSubject<string[] | string>(null);
  listboxValue$ = this.listboxValue.asObservable();
  inputValue = new BehaviorSubject<string>('');
  inputValue$ = this.inputValue.asObservable();
  vm$: Observable<ViewModel<string[]> | ViewModel<string>>;

  ngOnInit(): void {
    if (this.isMulti) {
      this.listboxFormControl = new FormControl<string[]>([]);
      this.listboxValue.next([]);
    } else {
      this.listboxFormControl = new FormControl<string>('');
      this.listboxValue.next('');
    }
    if (this.useFormControl) {
      this.initForFormControl();
    } else {
      this.initForOutputEmitter();
    }
  }

  initForFormControl(): void {
    const listboxValues$ = this.isMulti
      ? this.listboxFormControl.valueChanges.pipe(startWith([] as string[]))
      : this.listboxFormControl.valueChanges.pipe(startWith(''));

    this.vm$ = combineLatest([
      listboxValues$,
      this.searchFormControl.valueChanges.pipe(startWith('')),
    ]).pipe(
      map(([listboxValue, inputValue]) => {
        return this.isMulti
          ? this.getViewModelMulti(listboxValue as string[], inputValue)
          : this.getViewModelSingle(listboxValue as string, inputValue);
      })
    );
  }

  initForOutputEmitter(): void {
    this.vm$ = combineLatest([this.listboxValue$, this.inputValue$]).pipe(
      map(([listboxValue, inputValue]) => {
        return this.isMulti
          ? this.getViewModelMulti(listboxValue as string[], inputValue)
          : this.getViewModelSingle(listboxValue as string, inputValue);
      })
    );
  }

  getViewModelSingle(
    listboxValue: string,
    inputValue: string
  ): ViewModel<string> {
    const selected = this._options.filter((x) => x.id === listboxValue);
    const filteredOptions = this._options.filter((option) => {
      if (selected.length && inputValue === selected[0].displayName) {
        return option.id === listboxValue;
      } else {
        return this.optionIncludesSearchText(option, inputValue);
      }
    });
    return { options: filteredOptions, selected: listboxValue };
  }

  getViewModelMulti(
    listboxValue: string[],
    inputValue: string
  ): ViewModel<string[]> {
    const filteredOptions = this._options.filter((option) => {
      if (inputValue === '') {
        return true;
      } else {
        return this.optionIncludesSearchText(option, inputValue);
      }
    });
    return { options: filteredOptions, selected: listboxValue };
  }

  optionIncludesSearchText(
    option: { displayName: string; id: string },
    value: string
  ): boolean {
    return option.displayName.toLowerCase().includes(value?.toLowerCase());
  }

  onTyping(value: string): void {
    this.inputValue.next(value);
  }

  onSelection(value: string): void {
    this.listboxValue.next(value);
  }
}

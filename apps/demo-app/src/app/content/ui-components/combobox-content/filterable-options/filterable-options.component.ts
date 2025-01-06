import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HsiUiComboboxModule } from '@hsi/ui-components';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-filterable-options-combobox',
  standalone: true,
  imports: [CommonModule, HsiUiComboboxModule],
  templateUrl: './filterable-options.component.html',
  styleUrl: './filterable-options.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterableOptionsComboboxComponent {
  _options: { displayName: string; id: string }[] = [
    { displayName: 'Connecticut', id: 'CT' },
    { displayName: 'Maine', id: 'ME' },
    { displayName: 'Massachusetts', id: 'MA' },
    { displayName: 'New Hampshire', id: 'NH' },
    { displayName: 'Rhode Island', id: 'RI' },
    { displayName: 'Vermont', id: 'VT' },
  ];
  options = new BehaviorSubject<{ displayName: string; id: string }[]>(
    this._options
  );
  options$ = this.options.asObservable();
  value = signal('');

  onTyping(value: string): void {
    console.log(value);
    const filteredOptions = this._options.filter((option) =>
      option.displayName.toLowerCase().includes(value.toLowerCase())
    );
    console.log(filteredOptions);
    setTimeout(() => {
      this.options.next(
        filteredOptions.length ? filteredOptions : this._options
      );
    }, 0);
  }

  listboxValueChanges(value: string): void {
    console.log('value', value);
    this.value.set(value);
  }
}

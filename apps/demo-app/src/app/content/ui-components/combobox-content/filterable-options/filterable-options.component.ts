import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
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
    { displayName: 'Maine', id: 'ME' },
    { displayName: 'New Hampshire', id: 'NH' },
    { displayName: 'Vermont', id: 'VT' },
    { displayName: 'Massachusetts', id: 'MA' },
    { displayName: 'Rhode Island', id: 'RI' },
    { displayName: 'Connecticut', id: 'CT' },
  ];
  options: BehaviorSubject<{ displayName: string; id: string }[]> =
    new BehaviorSubject(this._options);
  options$ = this.options.asObservable();

  onTyping(value: string): void {
    this.options.next(
      this._options.filter((option) =>
        option.displayName.toLowerCase().includes(value.toLowerCase())
      )
    );
  }
}

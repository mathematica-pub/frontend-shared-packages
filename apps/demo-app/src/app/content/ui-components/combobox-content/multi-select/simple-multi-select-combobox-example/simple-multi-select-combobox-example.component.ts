import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ComboboxModule } from '@hsi/ui-components';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-simple-multi-select-combobox-example',
  standalone: true,
  imports: [CommonModule, ComboboxModule],
  templateUrl: './simple-multi-select-combobox-example.component.html',
  styleUrl: './simple-multi-select-combobox-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SimpleMultiSelectComboboxExampleComponent {
  options = [
    {
      displayName: 'Cambridge',
      id: 'cambridge',
    },
    {
      displayName: 'Washington, D.C.',
      id: 'dc',
    },
    { displayName: 'Oakland', id: 'oakland' },
    { displayName: 'Chicago', id: 'chicago' },
    {
      displayName: 'Ann Arbor',
      id: 'annArbor',
    },
    {
      displayName: 'Woodlawn',
      id: 'woodlawn',
    },
    {
      displayName: 'Princeton',
      id: 'princeton',
    },
  ];
  externalSelected = new BehaviorSubject<string[]>([]);
  externalSelected$ = this.externalSelected.asObservable();
  disabled = new BehaviorSubject<string[]>([]);
  disabled$ = this.disabled.asObservable();
  value = new BehaviorSubject<string[]>([]);
  value$ = this.value.asObservable();

  onSelection(selectedIds: string[]): void {
    this.value.next(selectedIds);
    this.externalSelected.next(selectedIds);
  }

  disableFirst() {
    const curr = this.disabled.value;
    this.disabled.next([...curr, this.options[0].id]);
  }

  enableFirst() {
    const curr = this.disabled.value;
    this.disabled.next(curr.filter((id) => id !== this.options[0].id));
  }

  selectSecond() {
    const curr = this.externalSelected.value;
    this.externalSelected.next([...curr, this.options[1].id]);
  }

  deselectSecond() {
    const curr = this.externalSelected.value;
    this.externalSelected.next(curr.filter((id) => id !== this.options[1].id));
  }

  clearValue() {
    this.externalSelected.next([]);
  }

  trackByFn(option: {
    displayName: string;
    id: string;
    disabled: boolean;
  }): string {
    return `${option.id}-${option.disabled}`;
  }
}

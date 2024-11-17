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
    { displayName: 'Cambridge', id: 'cambridge', disabled: true },
    { displayName: 'Washington, D.C.', id: 'dc', disabled: true },
    { displayName: 'Oakland', id: 'oakland', disabled: false },
    { displayName: 'Chicago', id: 'chicago', disabled: false },
    { displayName: 'Ann Arbor', id: 'annArbor', disabled: true },
    { displayName: 'Woodlawn', id: 'woodlawn', disabled: false },
    { displayName: 'Princeton', id: 'princeton', disabled: true },
  ];
  selected = new BehaviorSubject([]);
  selected$ = this.selected.asObservable();

  onSelection(selectedIds: string[]): void {
    this.selected.next(selectedIds);
  }
}

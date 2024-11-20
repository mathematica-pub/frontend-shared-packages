import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ComboboxModule } from '@hsi/ui-components';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-disabled-selections-multi-combobox-example',
  standalone: true,
  imports: [CommonModule, ComboboxModule],
  templateUrl: './disabled-selections-multi-combobox-example.component.html',
  styleUrl: './disabled-selections-multi-combobox-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DisabledSelectionsMultiComboboxExampleComponent {
  options = [
    { displayName: 'Cambridge', id: 'cambridge' },
    { displayName: 'Washington, D.C.', id: 'dc' },
    { displayName: 'Oakland', id: 'oakland' },
    { displayName: 'Chicago', id: 'chicago' },
    { displayName: 'Ann Arbor', id: 'annArbor' },
    { displayName: 'Woodlawn', id: 'woodlawn' },
    { displayName: 'Princeton', id: 'princeton' },
  ];
  selected = new BehaviorSubject([]);
  selected$ = this.selected.asObservable();

  onSelection(selectedIds: string[]): void {
    this.selected.next(selectedIds);
  }
}

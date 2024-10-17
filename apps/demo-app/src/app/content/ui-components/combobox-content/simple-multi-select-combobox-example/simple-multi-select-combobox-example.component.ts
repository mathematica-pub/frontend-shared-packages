import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { ComboboxModule } from 'dist/ui-components';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-simple-multi-select-combobox-example',
  standalone: true,
  imports: [CommonModule, ComboboxModule],
  templateUrl: './simple-multi-select-combobox-example.component.html',
  styleUrl: './simple-multi-select-combobox-example.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SimpleMultiSelectComboboxExampleComponent {
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

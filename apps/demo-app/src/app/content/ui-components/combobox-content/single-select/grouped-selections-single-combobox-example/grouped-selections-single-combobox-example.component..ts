import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { ComboboxModule } from '@hsi/ui-components';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-grouped-selections-single-combobox-example',
  standalone: true,
  imports: [CommonModule, ComboboxModule],
  templateUrl: './grouped-selections-single-combobox-example.component.html',
  styleUrl: './grouped-selections-single-combobox-example.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class GroupedSelectionsSingleComboboxExampleComponent {
  optionsGroup1 = [
    { displayName: 'A New Hope', id: 'newHope' },
    { displayName: 'The Empire Strikes Back', id: 'empire' },
    { displayName: 'Return of the Jedi', id: 'returnJedi' },
  ];
  optionsGroup2 = [
    { displayName: 'The Phantom Menace', id: 'phantom' },
    { displayName: 'Attack of the Clones', id: 'clones' },
    { displayName: 'Revenge of the Sith', id: 'sith' },
  ];
  selected = new BehaviorSubject<string>(null);
  selected$ = this.selected.asObservable();

  onSelection(selectedId: string): void {
    this.selected.next(selectedId);
  }
}

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ComboboxModule } from '@hsi/ui-components';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-grouped-selections-single-combobox-example',
  standalone: true,
  imports: [CommonModule, ComboboxModule],
  templateUrl: './grouped-selections-single-combobox-example.component.html',
  styleUrl: './grouped-selections-single-combobox-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class GroupedSelectionsSingleComboboxExampleComponent {
  originals = [
    { displayName: 'The Phantom Menace', id: 'phantom' },
    { displayName: 'Attack of the Clones', id: 'clones' },
    { displayName: 'Revenge of the Sith', id: 'sith' },
  ];
  prequels = [
    { displayName: 'A New Hope', id: 'newHope' },
    { displayName: 'The Empire Strikes Back', id: 'empire' },
    { displayName: 'Return of the Jedi', id: 'returnJedi' },
  ];

  selected = new BehaviorSubject<string>(null);
  selected$ = this.selected.asObservable();

  onSelection(selectedIds: string[]): void {
    this.selected.next(selectedIds[0]);
  }
}

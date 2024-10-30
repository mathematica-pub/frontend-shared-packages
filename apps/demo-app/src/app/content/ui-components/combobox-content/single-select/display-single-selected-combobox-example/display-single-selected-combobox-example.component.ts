import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { ComboboxModule } from 'dist/ui-components';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-display-single-selected-combobox-example',
  standalone: true,
  imports: [CommonModule, ComboboxModule],
  templateUrl: './display-single-selected-combobox-example.component.html',
  styleUrl: './display-single-selected-combobox-example.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class DisplaySingleSelectedComboboxExampleComponent {
  options = [
    { displayName: 'Ratatouille', id: 'rat' },
    { displayName: 'Finding Nemo', id: 'nemo' },
    { displayName: 'Toy Story', id: 'toy' },
    { displayName: 'Monsters Inc.', id: 'monstersInc' },
    { displayName: 'WALL-E', id: 'robot' },
    { displayName: 'Cars', id: 'cars' },
    { displayName: 'The Incredibles', id: 'incredibles' },
    { displayName: 'Inside Out', id: 'insideOut' },
    { displayName: 'Up', id: 'up' },
  ];
  selected = new BehaviorSubject<string>(null);
  selected$ = this.selected.asObservable();

  onSelection(selectedId: string): void {
    this.selected.next(selectedId);
  }
}

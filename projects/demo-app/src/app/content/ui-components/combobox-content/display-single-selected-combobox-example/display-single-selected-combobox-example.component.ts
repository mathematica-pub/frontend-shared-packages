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
  value = new BehaviorSubject<string>(null);
  value$ = this.value.asObservable();

  onSelection(event: string): void {
    this.value.next(event);
  }
}

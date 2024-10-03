import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { ComboboxModule } from 'dist/ui-components';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-disabled-selections-single-combobox-example',
  standalone: true,
  imports: [CommonModule, ComboboxModule],
  templateUrl: './disabled-selections-single-combobox-example.component.html',
  styleUrl: './disabled-selections-single-combobox-example.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class DisabledSelectionsSingleExampleComponent {
  options = [
    { displayName: 'Ratatouille', id: 'rat', disabled: true },
    { displayName: 'Finding Nemo', id: 'nemo', disabled: false },
    { displayName: 'Toy Story', id: 'toy', disabled: true },
    { displayName: 'Monsters Inc.', id: 'monstersInc', disabled: true },
    { displayName: 'WALL-E', id: 'robot', disabled: true },
    { displayName: 'Cars', id: 'cars', disabled: false },
    { displayName: 'The Incredibles', id: 'incredibles', disabled: false },
    { displayName: 'Inside Out', id: 'insideOut', disabled: true },
    { displayName: 'Up', id: 'up', disabled: false },
  ];
  value = new BehaviorSubject<string>(null);
  value$ = this.value.asObservable();

  onSelection(event: string): void {
    this.value.next(event);
  }
}

import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { ComboboxModule } from '@hsi/ui-components';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-find-on-search-single-combobox-example',
  standalone: true,
  imports: [CommonModule, ComboboxModule],
  templateUrl: './find-on-search-single-combobox-example.component.html',
  styleUrl: './find-on-search-single-combobox-example.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class FindOnSearchSingleComboboxExampleComponent {
  options = [
    { displayName: 'Ratatouille', id: 'rat', disabled: true },
    { displayName: 'Finding Nemo', id: 'nemo', disabled: false },
    { displayName: 'Toy Story', id: 'toy', disabled: false },
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

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ComboboxModule } from '@hsi/ui-components';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-disabled-selections-single-combobox-example',
  standalone: true,
  imports: [CommonModule, ComboboxModule],
  templateUrl: './disabled-selections-single-combobox-example.component.html',
  styleUrl: './disabled-selections-single-combobox-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DisabledSelectionsSingleExampleComponent {
  options = [
    { displayName: 'Ratatouille', id: 'rat', disabled: true },
    { displayName: 'Finding Nemo', id: 'nemo', disabled: false },
    { displayName: 'Toy Story', id: 'toy', disabled: false },
    { displayName: 'Monsters Inc.', id: 'monstersInc', disabled: true },
    { displayName: 'WALL-E', id: 'robot', disabled: false },
    { displayName: 'Cars', id: 'cars', disabled: false },
    { displayName: 'The Incredibles', id: 'incredibles', disabled: false },
    { displayName: 'Inside Out', id: 'insideOut', disabled: false },
    { displayName: 'Up', id: 'up', disabled: false },
  ];
  selected = new BehaviorSubject<string>(null);
  selected$ = this.selected.asObservable();

  onSelection(selectedIds: string[]): void {
    this.selected.next(selectedIds[0]);
  }
}

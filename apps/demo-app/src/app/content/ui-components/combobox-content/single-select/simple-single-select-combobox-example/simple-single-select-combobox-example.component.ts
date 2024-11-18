import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ComboboxModule } from '@hsi/ui-components';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-simple-single-select-combobox-example',
  standalone: true,
  imports: [CommonModule, ComboboxModule],
  templateUrl: './simple-single-select-combobox-example.component.html',
  styleUrl: './simple-single-select-combobox-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SimpleSingleSelectComboboxExampleComponent {
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

  onSelection(selectedIds: string[]): void {
    this.selected.next(selectedIds[0]);
  }
}

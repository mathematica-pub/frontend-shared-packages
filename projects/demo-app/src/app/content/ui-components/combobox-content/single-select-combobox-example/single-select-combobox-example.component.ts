import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ComboboxModule } from 'dist/ui-components';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-single-select-combobox-example',
  standalone: true,
  imports: [CommonModule, ComboboxModule],
  templateUrl: './single-select-combobox-example.component.html',
  styleUrl: './single-select-combobox-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SingleSelectComboboxExampleComponent {
  options = [
    { displayName: 'Ratatouille', id: 'rat' },
    { displayName: 'Finding Nemo', id: 'nemo' },
    { displayName: 'Toy Story', id: 'toy' },
    { displayName: 'Monsters Inc.', id: 'monsterInc' },
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

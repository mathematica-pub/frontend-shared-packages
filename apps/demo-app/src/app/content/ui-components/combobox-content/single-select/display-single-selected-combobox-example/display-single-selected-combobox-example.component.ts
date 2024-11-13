import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ComboboxModule } from 'dist/ui-components';
import { BehaviorSubject } from 'rxjs';
import { movieOptions } from '../combobox-options';

@Component({
  selector: 'app-display-single-selected-combobox-example',
  standalone: true,
  imports: [CommonModule, ComboboxModule],
  templateUrl: './display-single-selected-combobox-example.component.html',
  styleUrl: './display-single-selected-combobox-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DisplaySingleSelectedComboboxExampleComponent {
  options = movieOptions;
  selected = new BehaviorSubject<string>(null);
  selected$ = this.selected.asObservable();

  onSelection(selectedId: string): void {
    this.selected.next(selectedId);
  }
}

import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { ComboboxModule } from '@hsi/ui-components';
import { BehaviorSubject } from 'rxjs';
import { officeOptions } from '../../single-select/combobox-options';

@Component({
  selector: 'app-display-multi-selected-combobox-example',
  standalone: true,
  imports: [CommonModule, ComboboxModule],
  templateUrl: './display-multi-selected-combobox-example.component.html',
  styleUrl: './display-multi-selected-combobox-example.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class DisplayMultiSelectedComboboxExampleComponent {
  options = officeOptions;
  selected = new BehaviorSubject([]);
  selected$ = this.selected.asObservable();

  onSelection(selectedIds: string[]): void {
    this.selected.next(selectedIds);
  }
}

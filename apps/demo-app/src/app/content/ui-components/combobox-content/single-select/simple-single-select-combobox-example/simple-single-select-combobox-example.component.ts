import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { ComboboxModule } from '@hsi/ui-components';
import { BehaviorSubject } from 'rxjs';
import { movieOptions } from '../combobox-options';

@Component({
  selector: 'app-simple-single-select-combobox-example',
  standalone: true,
  imports: [CommonModule, ComboboxModule],
  templateUrl: './simple-single-select-combobox-example.component.html',
  styleUrl: './simple-single-select-combobox-example.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SimpleSingleSelectComboboxExampleComponent {
  options = movieOptions;
  selected = new BehaviorSubject<string>(null);
  selected$ = this.selected.asObservable();

  onSelection(selectedId: string): void {
    this.selected.next(selectedId);
  }
}

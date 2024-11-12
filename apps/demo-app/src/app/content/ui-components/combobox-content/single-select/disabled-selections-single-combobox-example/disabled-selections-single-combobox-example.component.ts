import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { ComboboxModule } from 'dist/ui-components';
import { BehaviorSubject } from 'rxjs';
import { movieOptions } from '../combobox-options';

@Component({
  selector: 'app-disabled-selections-single-combobox-example',
  standalone: true,
  imports: [CommonModule, ComboboxModule],
  templateUrl: './disabled-selections-single-combobox-example.component.html',
  styleUrl: './disabled-selections-single-combobox-example.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class DisabledSelectionsSingleExampleComponent {
  options = movieOptions;
  selected = new BehaviorSubject<string>(null);
  selected$ = this.selected.asObservable();

  onSelection(selectedId: string): void {
    this.selected.next(selectedId);
  }
}

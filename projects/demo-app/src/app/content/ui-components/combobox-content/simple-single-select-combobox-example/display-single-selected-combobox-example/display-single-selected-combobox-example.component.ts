import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { ComboboxModule } from 'dist/ui-components';
import { SimpleSingleSelectComboboxExampleComponent } from '../simple-single-select-combobox-example.component';

@Component({
  selector: 'app-display-single-selected-combobox-example',
  standalone: true,
  imports: [CommonModule, ComboboxModule],
  templateUrl: './display-single-selected-combobox-example.component.html',
  styleUrl: '../simple-single-select-combobox-example.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class DisplaySingleSelectedComboboxExampleComponent extends SimpleSingleSelectComboboxExampleComponent {}

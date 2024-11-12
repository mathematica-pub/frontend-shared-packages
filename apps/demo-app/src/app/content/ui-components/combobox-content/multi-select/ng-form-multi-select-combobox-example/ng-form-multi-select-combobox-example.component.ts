import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ComboboxModule } from 'dist/ui-components';
import { officeOptions } from '../../single-select/combobox-options';

@Component({
  selector: 'app-ng-form-multi-select-combobox-example',
  standalone: true,
  imports: [CommonModule, ComboboxModule],
  templateUrl: './ng-form-multi-select-combobox-example.component.html',
  styleUrl: './ng-form-multi-select-combobox-example.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class NgFormMultiSelectComboboxExampleComponent {
  options = officeOptions;
  control = new FormControl<string[]>([]);
}

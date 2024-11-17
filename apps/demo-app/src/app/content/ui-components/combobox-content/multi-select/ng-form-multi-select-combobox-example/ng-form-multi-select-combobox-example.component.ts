import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ComboboxModule } from 'dist/ui-components';

@Component({
  selector: 'app-ng-form-multi-select-combobox-example',
  standalone: true,
  imports: [CommonModule, ComboboxModule],
  templateUrl: './ng-form-multi-select-combobox-example.component.html',
  styleUrl: './ng-form-multi-select-combobox-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NgFormMultiSelectComboboxExampleComponent {
  options = [
    { displayName: 'Cambridge', id: 'cambridge', disabled: true },
    { displayName: 'Washington, D.C.', id: 'dc', disabled: true },
    { displayName: 'Oakland', id: 'oakland', disabled: false },
    { displayName: 'Chicago', id: 'chicago', disabled: false },
    { displayName: 'Ann Arbor', id: 'annArbor', disabled: true },
    { displayName: 'Woodlawn', id: 'woodlawn', disabled: false },
    { displayName: 'Princeton', id: 'princeton', disabled: true },
  ];
  control = new FormControl<string[]>([]);
}

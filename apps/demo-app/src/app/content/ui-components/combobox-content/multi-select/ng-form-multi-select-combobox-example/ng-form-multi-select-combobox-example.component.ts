import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ComboboxModule } from '@hsi/ui-components';

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
    { displayName: 'Cambridge', id: 'cambridge' },
    { displayName: 'Washington, D.C.', id: 'dc' },
    { displayName: 'Oakland', id: 'oakland' },
    { displayName: 'Chicago', id: 'chicago' },
    { displayName: 'Ann Arbor', id: 'annArbor' },
    { displayName: 'Woodlawn', id: 'woodlawn' },
    { displayName: 'Princeton', id: 'princeton' },
  ];
  control = new FormControl<string[]>([]);
}

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ComboboxModule } from 'dist/ui-components';
import { movieOptions } from '../combobox-options';

@Component({
  selector: 'app-ng-form-single-select-combobox-example',
  standalone: true,
  imports: [CommonModule, ComboboxModule],
  templateUrl: './ng-form-single-select-combobox-example.component.html',
  styleUrl: './ng-form-single-select-combobox-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NgFormSingleSelectComboboxExampleComponent {
  options = movieOptions;
  control = new FormControl<string>('');
}

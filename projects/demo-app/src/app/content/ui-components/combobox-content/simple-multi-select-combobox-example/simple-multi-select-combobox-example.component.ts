import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComboboxModule } from 'dist/ui-components';

@Component({
  selector: 'app-simple-multi-select-combobox-example',
  standalone: true,
  imports: [CommonModule, ComboboxModule],
  templateUrl: './simple-multi-select-combobox-example.component.html',
  styleUrl: './simple-multi-select-combobox-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleMultiSelectComboboxExampleComponent {}

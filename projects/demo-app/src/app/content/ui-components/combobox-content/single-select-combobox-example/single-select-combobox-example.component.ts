import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComboboxModule } from 'dist/ui-components';

@Component({
  selector: 'app-single-select-combobox-example',
  standalone: true,
  imports: [CommonModule, ComboboxModule],
  templateUrl: './single-select-combobox-example.component.html',
  styleUrl: './single-select-combobox-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleSelectComboboxExampleComponent {}

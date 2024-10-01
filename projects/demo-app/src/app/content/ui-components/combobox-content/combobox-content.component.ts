import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SinglePanelExampleDisplayComponent } from '../../core/single-panel-example-display/single-panel-example-display.component';
import { SplitPanelExampleDisplayComponent } from '../../core/split-panel-example-display/split-panel-example-display.component';
import { SimpleMultiSelectComboboxExampleComponent } from './simple-multi-select-combobox-example/simple-multi-select-combobox-example.component';

@Component({
  selector: 'app-combobox-content',
  standalone: true,
  imports: [
    CommonModule,
    SinglePanelExampleDisplayComponent,
    SplitPanelExampleDisplayComponent,
    SimpleMultiSelectComboboxExampleComponent,
  ],
  templateUrl: './combobox-content.component.html',
  styleUrls: ['../examples.scss', './combobox-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComboboxContentComponent {}

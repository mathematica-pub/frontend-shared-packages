import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SinglePanelExampleDisplayComponent } from '../../core/single-panel-example-display/single-panel-example-display.component';
import { SplitPanelExampleDisplayComponent } from '../../core/split-panel-example-display/split-panel-example-display.component';
import { DisplaySingleSelectedComboboxExampleComponent } from './simple-single-select-combobox-example/display-single-selected-combobox-example/display-single-selected-combobox-example.component';
import { SimpleSingleSelectComboboxExampleComponent } from './simple-single-select-combobox-example/simple-single-select-combobox-example.component';

@Component({
  selector: 'app-combobox-content',
  standalone: true,
  imports: [
    CommonModule,
    SinglePanelExampleDisplayComponent,
    SplitPanelExampleDisplayComponent,
    SimpleSingleSelectComboboxExampleComponent,
    DisplaySingleSelectedComboboxExampleComponent,
  ],
  templateUrl: './combobox-content.component.html',
  styleUrls: ['../examples.scss', './combobox-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComboboxContentComponent {}

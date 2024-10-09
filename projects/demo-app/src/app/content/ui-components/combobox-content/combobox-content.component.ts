import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SinglePanelExampleDisplayComponent } from '../../../platform/single-panel-example-display/single-panel-example-display.component';
import { SplitPanelExampleDisplayComponent } from '../../../platform/split-panel-example-display/split-panel-example-display.component';
import { ContentContainerComponent } from '../../content-container/content-container.component';
import { DisabledSelectionsSingleExampleComponent } from './disabled-selections-single-combobox-example/disabled-selections-single-combobox-example.component';
import { DisplaySingleSelectedComboboxExampleComponent } from './display-single-selected-combobox-example/display-single-selected-combobox-example.component';
import { FindOnSearchSingleComboboxExampleComponent } from './find-on-search-single-combobox-example/find-on-search-single-combobox-example.component';
import { NgFormSingleSelectComboboxExampleComponent } from './ng-form-single-select-combobox-example/ng-form-single-select-combobox-example.component';
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
    DisabledSelectionsSingleExampleComponent,
    FindOnSearchSingleComboboxExampleComponent,
    NgFormSingleSelectComboboxExampleComponent,
    ContentContainerComponent,
  ],
  templateUrl: './combobox-content.component.html',
  styleUrls: ['../../examples.scss', './combobox-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComboboxContentComponent {}

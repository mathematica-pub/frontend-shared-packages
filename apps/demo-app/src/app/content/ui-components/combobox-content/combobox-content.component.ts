import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SinglePanelExampleDisplayComponent } from '../../../platform/single-panel-example-display/single-panel-example-display.component';
import { ContentContainerComponent } from '../../content-container/content-container.component';
import { DisabledSelectionsMultiComboboxExampleComponent } from './multi-select/disabled-selections-multi-combobox-example/disabled-selections-multi-combobox-example.component';
import { DisplayMultiSelectedComboboxExampleComponent } from './multi-select/display-multi-selected-combobox-example/display-multi-selected-combobox-example.component';
import { EditableTextboxMultiSelectComboboxExampleComponent } from './multi-select/editable-textbox-multi-select-combobox-example/editable-textbox-multi-select-combobox-example.component';
import { NgFormMultiSelectComboboxExampleComponent } from './multi-select/ng-form-multi-select-combobox-example/ng-form-multi-select-combobox-example.component';
import { SimpleMultiSelectComboboxExampleComponent } from './multi-select/simple-multi-select-combobox-example/simple-multi-select-combobox-example.component';
import { DisabledSelectionsSingleExampleComponent } from './single-select/disabled-selections-single-combobox-example/disabled-selections-single-combobox-example.component';
import { DisplaySingleSelectedComboboxExampleComponent } from './single-select/display-single-selected-combobox-example/display-single-selected-combobox-example.component';
import { EditableTextboxSingleSelectComboboxExampleComponent } from './single-select/editable-textbox-single-select-combobox-example/editable-textbox-single-select-combobox-example.component';
import { NgFormSingleSelectComboboxExampleComponent } from './single-select/ng-form-single-select-combobox-example/ng-form-single-select-combobox-example.component';
import { SimpleSingleSelectComboboxExampleComponent } from './single-select/simple-single-select-combobox-example/simple-single-select-combobox-example.component';

@Component({
  selector: 'app-combobox-content',
  standalone: true,
  imports: [
    CommonModule,
    SinglePanelExampleDisplayComponent,
    SimpleMultiSelectComboboxExampleComponent,
    DisplayMultiSelectedComboboxExampleComponent,
    DisabledSelectionsMultiComboboxExampleComponent,
    NgFormMultiSelectComboboxExampleComponent,
    SimpleSingleSelectComboboxExampleComponent,
    DisplaySingleSelectedComboboxExampleComponent,
    DisabledSelectionsSingleExampleComponent,
    NgFormSingleSelectComboboxExampleComponent,
    EditableTextboxMultiSelectComboboxExampleComponent,
    EditableTextboxSingleSelectComboboxExampleComponent,
    ContentContainerComponent,
  ],
  templateUrl: './combobox-content.component.html',
  styleUrls: ['../../examples.scss', './combobox-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComboboxContentComponent {
  exampleHeight = '370px';
}

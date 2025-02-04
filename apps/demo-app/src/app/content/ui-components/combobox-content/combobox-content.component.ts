import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ListboxOptionComponent } from '@hsi/ui-components';
import { ContentContainerComponent } from '../../content-container/content-container.component';
import { ExternalSelectionsComponent } from './external-selections/external-selections.component';
import { FilterableOptionsMultiSelectFormControlComboboxComponent } from './filterable-options/filterable-options-multi-form-control/filterable-options-multi-form-control.component';
import { FilterableOptionsMultiSelectComboboxComponent } from './filterable-options/filterable-options-multi/filterable-options-multi.component';
import { FilterableOptionsSingleSelectFormControlComboboxComponent } from './filterable-options/filterable-options-single-form-control/filterable-options-single-form-control.component';
import { FilterableOptionsSingleSelectComboboxComponent } from './filterable-options/filterable-options-single/filterable-options-single.component';
import { MinimalImplementationComboboxComponent } from './minimal-implementation/minimal-implementation.component';

@Component({
  selector: 'app-combobox-content',
  standalone: true,
  imports: [
    CommonModule,
    ContentContainerComponent,
    ExternalSelectionsComponent,
    FilterableOptionsSingleSelectComboboxComponent,
    FilterableOptionsSingleSelectFormControlComboboxComponent,
    FilterableOptionsMultiSelectComboboxComponent,
    FilterableOptionsMultiSelectFormControlComboboxComponent,
    MinimalImplementationComboboxComponent,
  ],
  templateUrl: './combobox-content.component.html',
  styleUrls: ['../../examples.scss', './combobox-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComboboxContentComponent {
  exampleHeight = '370px';

  customLabel(selectedOptions: ListboxOptionComponent[]): string {
    if (selectedOptions.length === 0) {
      return 'No states selected';
    }
    return `${selectedOptions.length} states selected (${selectedOptions.map((option) => option.valueToEmit).join(', ')})`;
  }
}

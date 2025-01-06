import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ListboxOptionComponent } from '@hsi/ui-components';
import { ContentContainerComponent } from '../../content-container/content-container.component';
import { ExternalSelectionsComponent } from './external-selections/external-selections.component';
import { FilterableOptionsComboboxComponent } from './filterable-options/filterable-options.component';
import { MinimalImplementationComboboxComponent } from './minimal-implementation/minimal-implementation.component';
import { StephanieSpecialComponent } from './stephanie-special/stephanie-special.component';

@Component({
  selector: 'app-combobox-content',
  standalone: true,
  imports: [
    CommonModule,
    ContentContainerComponent,
    ExternalSelectionsComponent,
    FilterableOptionsComboboxComponent,
    MinimalImplementationComboboxComponent,
    StephanieSpecialComponent,
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

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  CountSelectedLabel,
  HsiUiComboboxModule,
  ListboxOptionComponent,
} from '@hsi/ui-components';

@Component({
  selector: 'app-minimal-implementation-combobox',
  standalone: true,
  imports: [CommonModule, HsiUiComboboxModule, MatIconModule],
  templateUrl: './minimal-implementation.component.html',
  styleUrl: './minimal-implementation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MinimalImplementationComboboxComponent {
  @Input() multiSelect = false;
  @Input() selectAll = false;
  @Input() dynamicLabel = true;
  @Input() countLabel: CountSelectedLabel;
  @Input() customLabel: (selectedOptions: ListboxOptionComponent[]) => string;
  @Input() listboxLabel = false;
  @Input() groups = false;
  @Input() icons = false;
  options: { displayName: string; id: string }[] = [
    { displayName: 'Maine', id: 'ME' },
    { displayName: 'New Hampshire', id: 'NH' },
    { displayName: 'Vermont', id: 'VT' },
    { displayName: 'Massachusetts', id: 'MA' },
    { displayName: 'Rhode Island', id: 'RI' },
    { displayName: 'Connecticut', id: 'CT' },
  ];
  midAtlanticOptions: { displayName: string; id: string }[] = [
    { displayName: 'New York', id: 'NY' },
    { displayName: 'New Jersey', id: 'NJ' },
    { displayName: 'Pennsylvania', id: 'PA' },
    { displayName: 'Delaware', id: 'DE' },
    { displayName: 'Maryland', id: 'MD' },
    { displayName: 'District of Columbia', id: 'DC' },
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSelection(selected: string): void {
    return;
  }
}

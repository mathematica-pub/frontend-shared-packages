import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import {
  HsiUiComboboxModule,
  ListboxOptionComponent,
  SelectedCountLabel,
} from '@hsi/ui-components';

@Component({
  selector: 'app-stephanie-special',
  standalone: true,
  imports: [CommonModule, HsiUiComboboxModule, MatIconModule],
  templateUrl: './stephanie-special.component.html',
  styleUrl: './stephanie-special.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StephanieSpecialComponent implements OnInit {
  @Input() countLabel: SelectedCountLabel;
  @Input() customLabel: (selectedOptions: ListboxOptionComponent[]) => string;
  @Input() dynamicLabel = true;
  @Input() externalLabel = false;
  @Input() groups = false;
  @Input() icons = false;
  @Input() multiSelect = true;
  @Input() selectAll = false;
  control: FormControl<string[]>;
  options: { displayName: string; id: string }[] = [
    { displayName: 'Connecticut', id: 'CT' },
    { displayName: 'Maine', id: 'ME' },
    { displayName: 'Massachusetts', id: 'MA' },
    { displayName: 'New Hampshire', id: 'NH' },
    { displayName: 'Rhode Island', id: 'RI' },
    { displayName: 'Vermont', id: 'VT' },
  ];
  midAtlanticOptions: { displayName: string; id: string }[] = [
    { displayName: 'Delaware', id: 'DE' },
    { displayName: 'District of Columbia', id: 'DC' },
    { displayName: 'Maryland', id: 'MD' },
    { displayName: 'New Jersey', id: 'NJ' },
    { displayName: 'New York', id: 'NY' },
    { displayName: 'Pennsylvania', id: 'PA' },
  ];

  ngOnInit(): void {
    this.control = new FormControl(['Vermont', 'Maryland']);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSelection(selected: string): void {
    return;
  }
}

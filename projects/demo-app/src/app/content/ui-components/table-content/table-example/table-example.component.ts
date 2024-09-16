import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  TableColumn,
  TableModule,
} from 'projects/ui-components/src/public-api';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-table-example',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './table-example.component.html',
  styleUrl: './table-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableExampleComponent {
  config$ = new BehaviorSubject({
    data: [
      { fruit: 'apple', color: 'red' },
      { fruit: 'orange', color: 'orange' },
      { fruit: 'banana', color: 'yellow' },
    ],
    columns: [
      new TableColumn<{ fruit: string; color: string }>({
        label: 'Fruit',
        getFormattedValue: (x) => x.fruit,
        sortable: true,
      }),
      new TableColumn<{ fruit: string; color: string }>({
        label: 'Color',
        getFormattedValue: (x) => x.color,
        sortable: true,
      }),
    ],
  });
}

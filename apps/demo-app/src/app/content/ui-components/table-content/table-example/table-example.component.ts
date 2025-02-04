import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  HsiUiTableDataSource,
  TableColumn,
  TableModule,
} from '@hsi/ui-components';
import { of } from 'rxjs';

enum ColumnNames {
  fruit = 'fruit',
  color = 'color',
}

@Component({
  selector: 'app-table-example',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './table-example.component.html',
  styleUrl: './table-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableExampleComponent {
  columnIds = [ColumnNames.fruit, ColumnNames.color];
  data$ = of([
    { fruit: 'apple', color: 'red' },
    { fruit: 'orange', color: 'orange' },
    { fruit: 'banana', color: 'yellow' },
  ]);
  ColumnNames = ColumnNames;

  columns$ = of([
    new TableColumn<{ fruit: string; color: string }>({
      id: ColumnNames.fruit,
      ascendingSortFunction: (a, b) => a.fruit.localeCompare(b.fruit),
      sortOrder: 1,
      sortDirection: 'asc', // initial sort direction
    }),
    new TableColumn<{ fruit: string; color: string }>({
      id: ColumnNames.color,
      sortable: true,
      ascendingSortFunction: (a, b) => a.color.localeCompare(b.color),
    }),
  ]);
  dataSource = new HsiUiTableDataSource(this.data$, this.columns$);
}

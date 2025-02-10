import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
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
  styleUrls: ['../../../examples.scss', './table-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TableExampleComponent {
  @Input() sortIcon: string = 'arrow_upward';
  columnIds = [ColumnNames.fruit, ColumnNames.color];
  data$ = of([
    { fruit: 'lemon', color: 'yellow' },
    { fruit: 'mango', color: 'orange' },
    { fruit: 'avocado', color: 'green' },
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
      sortable: true,
      sortDirection: 'asc', // initial sort direction
      getFormattedValue: (x) => x.fruit,
    }),
    new TableColumn<{ fruit: string; color: string }>({
      id: ColumnNames.color,
      sortable: true,
      ascendingSortFunction: (a, b) => a.color.localeCompare(b.color),
      getFormattedValue: (x) => x.color,
    }),
  ]);
  dataSource = new HsiUiTableDataSource(this.data$, this.columns$);
  columnTrackingFunction(
    _: number,
    column: TableColumn<{ fruit: string; color: string }>
  ) {
    return column.id;
  }
}

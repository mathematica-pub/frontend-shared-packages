import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TableColumn, TableModule } from '@hsi/ui-components';
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
  data$ = new BehaviorSubject({
    data: [
      { fruit: 'apple', color: 'red' },
      { fruit: 'orange', color: 'orange' },
      { fruit: 'banana', color: 'yellow' },
    ],
  });

  sortColumnConfig = [
    new TableColumn<{ fruit: string; color: string }>({
      cdkColumnDef: 'fruit',
      ascendingSortFunction: (a, b) => a.fruit.localeCompare(b.fruit),
      sortOrder: 1,
      sortDirection: 'asc', // initial sort direction
    }),
    new TableColumn<{ fruit: string; color: string }>({
      cdkColumnDef: 'color',
      sortable: true,
      ascendingSortFunction: (a, b) => a.color.localeCompare(b.color),
    }),
  ];
  dataSource = new HsiUiTableDataSource(data$, sortColumnConfig);

  // handleSort()
}

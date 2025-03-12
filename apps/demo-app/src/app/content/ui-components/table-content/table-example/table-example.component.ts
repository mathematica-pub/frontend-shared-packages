import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Input,
  OnInit,
} from '@angular/core';
import {
  HsiUiTableDataSource,
  TableColumn,
  TableModule,
} from '@hsi/ui-components';
import { TableColumnBuilder } from 'libs/ui-components/src/lib/table/table-column-builder';
import { map, Observable, of, shareReplay } from 'rxjs';

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
})
export class TableExampleComponent implements OnInit {
  @Input() sortIcon: string = 'arrow_upward';
  data$: Observable<{ fruit: string; color: string }[]>;
  columns$: Observable<TableColumn<{ fruit: string; color: string }>[]>;
  dataSource: HsiUiTableDataSource<{ fruit: string; color: string }>;
  tableHeaders$: Observable<string[]>;
  constructor(private destroyRef: DestroyRef) {}

  ngOnInit(): void {
    this.setTableData();
    this.setDataSource();
    this.setTableHeaders();
  }

  setTableData() {
    this.data$ = of([
      { fruit: 'lemon', color: 'yellow' },
      { fruit: 'mango', color: 'orange' },
      { fruit: 'avocado', color: 'green' },
      { fruit: 'apple', color: 'red' },
      { fruit: 'orange', color: 'orange' },
      { fruit: 'banana', color: 'yellow' },
    ]);
    this.columns$ = of([
      new TableColumnBuilder<{ fruit: string; color: string }>()
        .label(ColumnNames.fruit)
        .ascendingSortFunction((a, b) => a.fruit.localeCompare(b.fruit))
        .sortOrder(1)
        .sortable(true)
        .sortDirection('asc') // initial sort direction
        .getFormattedValue((x) => x.fruit)
        .getColumn('FruitColumn'),
      new TableColumnBuilder<{ fruit: string; color: string }>()
        .label(ColumnNames.color)
        .sortable(true)
        .ascendingSortFunction((a, b) => a.color.localeCompare(b.color))
        .getFormattedValue((x) => x.color)
        .getColumn('ColorColumn'),
    ]);
  }
  setDataSource() {
    this.dataSource = new HsiUiTableDataSource(this.data$, this.columns$);
  }
  setTableHeaders(): void {
    this.tableHeaders$ = this.columns$.pipe(
      map((columns) => columns.map((x) => x.id)),
      shareReplay(1)
    );
  }
}

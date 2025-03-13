import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  HsiUiTableDataSource,
  TableColumn,
  TableColumnsBuilder,
  TableModule,
} from '@hsi/ui-components';
import { distinctUntilChanged, map, Observable, of, shareReplay } from 'rxjs';

enum ColumnNames {
  fruit = 'fruit',
  color = 'color',
}

@Component({
  selector: 'app-custom-sort-table-example',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './custom-sort-table-example.component.html',
  styleUrls: [
    '../../../examples.scss',
    './custom-sort-table-example.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomSortIconExampleTableComponent implements OnInit {
  sortIcon: string = 'arrow_upward';
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
    this.columns$ = of(
      new TableColumnsBuilder<{ fruit: string; color: string }>()
        .addColumn((column) =>
          column
            .label(ColumnNames.fruit)
            .ascendingSortFunction((a, b) => a.fruit.localeCompare(b.fruit))
            .sortOrder(1)
            .sortable(true)
            .sortDirection('asc') // initial sort direction
            .getFormattedValue((x) => x.fruit)
        )
        .addColumn((column) =>
          column
            .label(ColumnNames.color)
            .sortable(true)
            .ascendingSortFunction((a, b) => a.color.localeCompare(b.color))
            .getFormattedValue((x) => x.color)
        )
        .getConfig()
    );
  }
  setDataSource() {
    this.dataSource = new HsiUiTableDataSource(this.data$, this.columns$);
  }
  setTableHeaders(): void {
    this.tableHeaders$ = this.columns$.pipe(
      map((columns) => columns.map((x) => x.id)),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef),
      shareReplay(1)
    );
  }
}

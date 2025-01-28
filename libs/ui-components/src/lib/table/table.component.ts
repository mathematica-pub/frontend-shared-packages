import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { min } from 'd3';
import { isEqual } from 'lodash-es';
import {
  BehaviorSubject,
  Observable,
  distinctUntilChanged,
  filter,
  map,
  merge,
  scan,
  shareReplay,
  withLatestFrom,
} from 'rxjs';
import { SortDirection, TableColumn } from './table-column';
import { HsiUiTableConfig } from './table.config';

@Component({
  selector: 'hsi-ui-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<Datum> implements OnInit {
  @Input() config$: Observable<HsiUiTableConfig<Datum>>;
  @Input() sortIcon = 'arrow_upward';
  data$: Observable<Datum[]>;
  columns$: Observable<TableColumn<Datum>[]>;
  tableHeaders$: Observable<string[]>;
  sort: BehaviorSubject<TableColumn<Datum>> = new BehaviorSubject(null);
  sort$: Observable<TableColumn<Datum>> = this.sort.asObservable();

  constructor(private destroyRef: DestroyRef) {}

  ngOnInit(): void {
    this.setTableData();
    this.setTableHeaders();
    this.validateRowHeaders();
  }

  setTableData(): void {
    const config$ = this.config$.pipe(
      withLatestFrom(this.sort$),
      map(([config, sort]) => () => {
        const activeSortColumn =
          sort || this.getMinSortOrderColumn(config.columns);
        const columns = this.getColumnsWithNewSortApplied(
          activeSortColumn,
          config.columns,
          false
        );
        return {
          data: this.sortData(config.data, activeSortColumn, columns),
          columns,
        };
      })
    );

    const sort$ = this.sort$.pipe(
      filter((sort) => sort !== null),
      map((sort) => (sortedConfig: HsiUiTableConfig<Datum>) => {
        const columns = this.getColumnsWithNewSortApplied(
          sort,
          sortedConfig.columns
        );
        return {
          data: this.sortData(sortedConfig.data, sort, columns),
          columns,
        };
      })
    );
    const sortedConfig$ = merge(config$, sort$).pipe(
      scan((sortedConfig, changeFn) => changeFn(sortedConfig), {
        data: [],
        columns: [],
      }),
      shareReplay(1) // do not remove sort toggle will be called twice
    );

    this.data$ = sortedConfig$.pipe(
      map((x) => x.data),
      shareReplay(1)
    );
    this.columns$ = sortedConfig$.pipe(
      map((x) => x.columns),
      shareReplay(1)
    );
  }

  getMinSortOrderColumn(columns: TableColumn<Datum>[]): TableColumn<Datum> {
    const minSortOrder = min(columns, (x) => x.sortOrder);
    return columns.find((x) => x.sortOrder === minSortOrder);
  }

  getColumnsWithNewSortApplied(
    activeSortColumn: TableColumn<Datum>,
    columns: TableColumn<Datum>[],
    toggleSortDirection = true
  ): TableColumn<Datum>[] {
    const columnsWithSortDir = columns.map((x) => {
      if (x.label === activeSortColumn.label) {
        if (toggleSortDirection) {
          x.sortDirection =
            x.sortDirection === SortDirection.asc
              ? SortDirection.desc
              : SortDirection.asc;
        }
        x.activelySorted = true;
      } else {
        if (toggleSortDirection) {
          x.sortDirection = x.initialSortDirection;
        }
        x.activelySorted = false;
      }
      return x;
    });
    return columnsWithSortDir;
  }

  setTableHeaders(): void {
    this.tableHeaders$ = this.columns$.pipe(
      map((columns) => columns.map((x) => x.label)),
      distinctUntilChanged((a, b) => isEqual(a, b)),
      shareReplay(1)
    );
  }

  validateRowHeaders(): void {
    this.columns$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((columns) => {
        const rowHeaders = columns.filter((x) => x.isRowHeader);
        if (rowHeaders.length > 1) {
          throw new Error(
            'Table can only have one row header column. Please update your column config.'
          );
        }
      });
  }

  sortTableByColumn(column: TableColumn<Datum>) {
    this.sort.next(column);
  }

  sortData(
    data: Datum[],
    primaryColumnSort: TableColumn<Datum>,
    columns: TableColumn<Datum>[]
  ): Datum[] {
    const sortedColumns = columns.slice().sort((columnA, columnB) => {
      return columnA.label === primaryColumnSort.label
        ? -1
        : columnB.label === primaryColumnSort.label
          ? 1
          : columnA.sortOrder - columnB.sortOrder;
    });

    const sortedData = data.slice().sort((a, b) => {
      for (const column of sortedColumns) {
        let returnValue = column.ascendingSortFunction(a, b);
        if (column.sortDirection === SortDirection.desc) {
          returnValue *= -1;
        }
        if (returnValue !== 0) return returnValue;
      }
      return 0;
    });
    return sortedData;
  }

  columnTrackingFunction(_: number, column: TableColumn<Datum>) {
    return column.label;
  }
}


hsiUiTableHeader
class HsiUiTableDataSource extends DataSource<Datum> {

  // user inputs the full data 
  // user inputs some column sorting configuration 
  constructor(private inputData$: Observable<Datum[]>, private sortConfig: TableColumn<Datum>[]) {
    super();
    this.transformedData$ = combineLatest([sortConfig$, this.inputData$]).pipe(return subsetData)
  }

  handleSort(column: whateverDataTypeThisIs) {
    this.sortConfig[column] -- what is the sort function? use some smart default if not provided 
    handle tiebreaks using this.sortConfig[column].sortOrder (will need other columns' sort functions & orders)
  }
  override connect(): Observable<readonly Datum[]> {
      return this.transformedData$;
  }
}
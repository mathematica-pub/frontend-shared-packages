import { DataSource } from '@angular/cdk/collections';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  filter,
  map,
  merge,
  scan,
  shareReplay,
  withLatestFrom,
} from 'rxjs';
import { SortDirection, TableColumn } from './table-column';

/**
 * @deprecated This class is deprecated. See `tanstack-example.component.ts` for the recommended implementation.
 */
export class HsiUiTableDataSource<Datum> extends DataSource<Datum> {
  private sortedData$: Observable<Datum[]>;

  private sortColId = new BehaviorSubject<string>(null);
  private sortColId$ = this.sortColId.asObservable();

  columns$: Observable<TableColumn<Datum>[]>;
  columnIds$: Observable<string[]>;

  // TODO: plan sort column directive
  constructor(
    inputData$: Observable<Datum[]>,
    inputColumns$: Observable<TableColumn<Datum>[]>
  ) {
    super();
    this.columns$ = inputColumns$.pipe(shareReplay(1));
    this.columnIds$ = this.columns$.pipe(
      map((columns) => columns.map((x) => x.id))
    );
    const config$ = combineLatest([inputData$, this.columns$]).pipe(
      withLatestFrom(this.sortColId$),
      map(([[data, cols], sortId]) => () => {
        const columns = this.getColumnsWithNewSortApplied(sortId, cols, false);
        return {
          data: sortId ? this.sortData(data, sortId, columns) : data,
          columns,
        };
      })
    );

    const sort$ = this.sortColId$.pipe(
      filter((sortId) => sortId !== null),
      map(
        (sortId) =>
          (sortedConfig: { data: Datum[]; columns: TableColumn<Datum>[] }) => {
            const columns = this.getColumnsWithNewSortApplied(
              sortId,
              sortedConfig.columns,
              true
            );
            return {
              data: this.sortData(sortedConfig.data, sortId, columns),
              columns: columns,
            };
          }
      )
    );

    const sortedConfig$ = merge(config$, sort$).pipe(
      scan((sortedConfig, changeFn) => changeFn(sortedConfig), {
        data: [],
        columns: [],
      }),
      shareReplay(1) // do not remove sort toggle will be called twice
    );

    this.sortedData$ = sortedConfig$.pipe(
      map((x) => x.data),
      shareReplay(1)
    );
    this.columns$ = sortedConfig$.pipe(
      map((x) => x.columns),
      shareReplay(1)
    );
  }

  sortData(
    data: Datum[],
    primaryColumnSortId: string,
    columns: TableColumn<Datum>[]
  ): Datum[] {
    const sortedColumns = columns.slice().sort((columnA, columnB) => {
      return columnA.id === primaryColumnSortId
        ? -1
        : columnB.id === primaryColumnSortId
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

  getColumnsWithNewSortApplied(
    activeSortColumnId: string,
    columns: TableColumn<Datum>[],
    toggleSortDirection = true
  ): TableColumn<Datum>[] {
    const columnsWithSortDir = columns.map((x) => {
      if (x.id === activeSortColumnId) {
        if (toggleSortDirection && x.sortedOnInit) {
          x.sortDirection =
            x.sortDirection === SortDirection.asc
              ? SortDirection.desc
              : SortDirection.asc;
        } else if (toggleSortDirection) {
          x.sortedOnInit = true;
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

  sort(column: TableColumn<Datum>) {
    this.sortColId.next(column.id);
  }

  disconnect(): void {}

  connect(): Observable<Datum[]> {
    return this.sortedData$;
  }
}

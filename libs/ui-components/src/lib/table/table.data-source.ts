import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { CdkHeaderRowDef } from '@angular/cdk/table';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { SortDirection, TableColumn } from './table-column';

export class HsiUiTableHeader extends CdkHeaderRowDef {}

export class HsiUiTableDataSource<Datum> extends DataSource<Datum> {
  private data = new BehaviorSubject<Datum[]>([]);
  private data$ = this.data.asObservable();
  private columns = new BehaviorSubject<TableColumn<Datum>[]>([]);
  // user inputs the full data
  // user inputs some column sorting configuration

  // TODO: get rid of subscribe, use rxjs operators instead
  // TODO: clean up table-column.ts only use properties used in this class
  // TODO: add sort icon to table example
  // TODO: plan sort column directive
  constructor(
    private inputData$: Observable<Datum[]>,
    private columns$: Observable<TableColumn<Datum>[]>
  ) {
    super();

    columns$.subscribe((columns) => {
      this.columns.next(columns);
    });
    combineLatest([columns$, inputData$])
      .pipe(
        map(([sort, data]) => {
          console.log(data, sort);
          return data;
        })
      )
      .subscribe((data) => this.data.next(data));
  }

  handleSort(columnId: string) {
    const sortedColumns = this.columns
      .getValue()
      .slice()
      .sort((columnA, columnB) => {
        return columnA.id === columnId
          ? -1
          : columnB.id === columnId
            ? 1
            : columnA.sortOrder - columnB.sortOrder;
      });

    const sortedData = this.data
      .getValue()
      .slice()
      .sort((a, b) => {
        for (const column of sortedColumns) {
          let returnValue = column.ascendingSortFunction(a, b);
          if (column.sortDirection === SortDirection.desc) {
            returnValue *= -1;
          }
          if (returnValue !== 0) return returnValue;
        }
        return 0;
      });

    sortedColumns[0].sortDirection =
      sortedColumns[0].sortDirection == SortDirection.asc
        ? SortDirection.desc
        : SortDirection.asc;

    this.columns.next(sortedColumns);
    this.data.next(sortedData);
  }

  override disconnect(_collectionViewer: CollectionViewer): void {}

  override connect(_collectionViewer: CollectionViewer): Observable<Datum[]> {
    return this.data$;
  }
}

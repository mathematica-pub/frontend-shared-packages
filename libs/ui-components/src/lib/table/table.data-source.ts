import { ArrayDataSource } from '@angular/cdk/collections';
import { CdkHeaderRowDef } from '@angular/cdk/table';
import { Observable, combineLatest, map } from 'rxjs';
import { TableColumn } from './table-column';

export class HsiUiTableHeader extends CdkHeaderRowDef {}

export class HsiUiTableDataSource<T> extends ArrayDataSource<T> {
  private transformedData$: Observable<readonly T[]>;
  // user inputs the full data
  // user inputs some column sorting configuration
  constructor(
    private inputData$: Observable<T[]>,
    private sortConfig$: TableColumn<T>[]
  ) {
    super(inputData$);
    this.transformedData$ = combineLatest([sortConfig$, inputData$]).pipe(
      map(([sort, data]) => data)
    );
  }

  handleSort(column: TableColumn<T>) {
    // this.sortConfig[column] -- what is the sort function? use some smart default if not provided
    // handle tiebreaks using this.sortConfig[column].sortOrder (will need other columns' sort functions & orders)
  }

  override disconnect(): void {}

  override connect(): Observable<readonly T[]> {
    return this.transformedData$;
  }
}

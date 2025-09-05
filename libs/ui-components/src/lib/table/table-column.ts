import { safeAssign } from '@hsi/app-dev-kit';
import { ascending } from 'd3';

export enum SortDirection {
  asc = 'asc',
  desc = 'desc',
}

export type SortDirectionType = keyof typeof SortDirection;
export type TableValue = string | number | boolean | Date;

/**
 * @deprecated This class is deprecated. See use of `ColumnDef` in `tanstack-example.component.ts` for the recommended implementation.
 */
export class TableColumn<Datum> {
  /**
   * The unique id of the column.
   * */
  readonly id: string;
  /**
   * The unique key of the column. Used for sorting and accessing the column data.
   *
   */
  readonly key: string;
  /**
   * The label of the column. Used in the table header.
   * This field is required when using the `single-sort-header` component.
   */
  label: string;
  /**
   * Function to extract the value to be sorted on from the datum.
   * If not provided, the formatted value will be used for sorting.
   */
  getSortValue: (x: Datum) => TableValue;
  /**
   * Function to determine the sort order of the column.
   * If not provided, sort with use d3.ascending on the getSortValue or getFormattedValue.
   */
  ascendingSortFunction: (a: Datum, b: Datum) => number;
  /**
   * The direction to start sorting this column in.
   * @default SortDirection.asc
   */
  sortDirection: SortDirectionType = SortDirection.asc;
  /**
   * Whether the column is sortable.
   */
  sortable = false;
  activelySorted: boolean;
  /**
   * The sort order of the column. Used to determine the order of sorting when multiple columns are sorted.
   * Sorting tiebreaks are determined by increasing sortOrder number.
   **/
  sortOrder: number = Number.MAX_SAFE_INTEGER;
  readonly initialSortDirection: SortDirectionType;
  /**
   * Whether the column data has been sorted since initialization.
   */
  sortedOnInit = false;
  constructor(init?: Partial<TableColumn<Datum>>) {
    this.sortDirection = SortDirection.asc;
    // this.getAlignment = () => 'left';
    safeAssign(this, init);
    this.initialSortDirection = this.sortDirection;
    if (this.ascendingSortFunction === undefined) {
      this.ascendingSortFunction = this.defaultSort;
    }
  }

  defaultSort(a: Datum, b: Datum): number {
    const accessor = this.getSortValue;
    return ascending(accessor(a), accessor(b));
  }
}

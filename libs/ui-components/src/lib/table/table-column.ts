import { safeAssign } from '@mathstack/app-kit';
import { ascending } from 'd3';

export enum SortDirection {
  asc = 'asc',
  desc = 'desc',
}

export type SortDirectionType = keyof typeof SortDirection;
export type TableValue = string | number | boolean | Date;
export type TableCellAlignment = 'left' | 'center' | 'right';

export class TableColumn<Datum> {
  /**
   * The label of the column. Used in the table header.
   * */
  label: string;
  /**
   * Function to extract the value to be sorted on from the datum.
   * If not provided, the formatted value will be used for sorting.
   */
  getSortValue: (x: Datum) => TableValue;
  /**
   * Function to format the value for display in the table.
   */
  getFormattedValue: (x: Datum) => string;
  /**
   * Function to determine the alignment of the cell content.
   */
  getAlignment: (x: Datum) => TableCellAlignment;
  /**
   * Width of the column. Can be a percentage or pixel value.
   */
  width: string;
  /**
   * Function to determine the sort order of the column.
   * If not provided, sort with use d3.ascending on the getSortValue or getFormattedValue.
   */
  ascendingSortFunction: (a: Datum, b: Datum) => number;
  sortDirection: SortDirectionType;
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
  /**
   * Whether the column is a row header.
   */
  isRowHeader = false;
  readonly initialSortDirection: SortDirectionType;

  constructor(init?: Partial<TableColumn<Datum>>) {
    this.sortDirection = SortDirection.asc;
    this.getAlignment = () => 'left';
    safeAssign(this, init);
    this.initialSortDirection = this.sortDirection;
    if (this.ascendingSortFunction === undefined) {
      this.ascendingSortFunction = this.defaultSort;
    }
  }

  defaultSort(a: Datum, b: Datum): number {
    const accessor = this.getSortValue || this.getFormattedValue;
    return ascending(accessor(a), accessor(b));
  }
}

export enum SortDirection {
  asc = 'asc',
  desc = 'desc',
}

export type SortDirectionType = keyof typeof SortDirection;
export type TableValue = string | number | boolean | Date;

export class TableColumn<Datum> {
  /**
   * The id of the column. Used in the table header.
   * */
  id: string;
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
    Object.assign(this, init);
    this.initialSortDirection = this.sortDirection;
  }
}

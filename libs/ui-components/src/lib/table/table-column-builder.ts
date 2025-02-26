import {
  SortDirection,
  SortDirectionType,
  TableColumn,
  TableValue,
} from './table-column';

const DEFAULT = {
  _sortable: false,
  _sortedOnInit: false,
  _sortOrder: Number.MAX_SAFE_INTEGER,
  _sortDirection: SortDirection.asc,
};

export class TableColumnBuilder<Datum> {
  private _id: string;
  private _getSortValue: (x: Datum) => TableValue;
  private _getFormattedValue: (x: Datum) => string;
  private _ascendingSortFunction: (a: Datum, b: Datum) => number;
  private _sortDirection: SortDirectionType;
  private _sortable: boolean;
  private _activelySorted: boolean; // init false?
  private _sortOrder: number;
  private _sortedOnInit: boolean; // should this go?

  constructor() {
    Object.assign(this, DEFAULT);
  }

  /**
   * NOT OPTIONAL. A boolean to determine whether the column is sortable.
   *
   */
  id(id: string): this {
    this._id = id;
    return this;
  }

  /**
   * OPTIONAL. A function to extract the value to be sorted on from the datum.
   * If not provided, the formatted value will be used for sorting.
   *
   * To unset, call with `null`.
   */
  getSortValue(getSortValue: null): this;
  getSortValue(getSortValue: (x: Datum) => TableValue): this;
  getSortValue(getSortValue: (x: Datum) => TableValue | null): this {
    if (getSortValue === null) {
      this._getSortValue = undefined;
      return this;
    }
    this._getSortValue = getSortValue;
    return this;
  }

  /**
   * OPTIONAL. A function to format the value for display in the table.
   *
   * To unset, call with `null`.
   */
  getFormattedValue(getFormattedValue: null): this;
  getFormattedValue(getFormattedValue: (x: Datum) => string): this;
  getFormattedValue(getFormattedValue: (x: Datum) => string | null): this {
    if (getFormattedValue === null) {
      this._getFormattedValue = undefined;
      return this;
    }
    this._getFormattedValue = getFormattedValue;
    return this;
  }

  /**
   * OPTIONAL. A function to determine the sort order of the column.
   * If not provided, sort with use d3.ascending on the getSortValue or getFormattedValue.
   *
   * To unset, call with `null`.
   */
  ascendingSortFunction(ascendingSortFunction: null): this;
  ascendingSortFunction(
    ascendingSortFunction: (a: Datum, b: Datum) => number
  ): this;
  ascendingSortFunction(
    ascendingSortFunction: (a: Datum, b: Datum) => number | null
  ): this {
    if (ascendingSortFunction === null) {
      this._ascendingSortFunction = undefined;
      return this;
    }
    this._ascendingSortFunction = ascendingSortFunction;
    return this;
  }

  /**
   * OPTIONAL. The direction to start sorting this column in.
   *
   * @default SortDirection.asc
   */
  sortDirection(sortDirection: SortDirectionType): this {
    this._sortDirection = sortDirection;
    return this;
  }

  /**
   * OPTIONAL. A boolean to determine whether the column is sortable.
   *
   * @default false
   */
  sortable(sortable: boolean): this {
    this._sortable = sortable;
    return this;
  }

  /**
   * OPTIONAL. A number representing the sort order of the column.
   *
   * @default Number.MAX_SAFE_INTEGER
   */
  sortOrder(sortOrder: number): this {
    this._sortOrder = sortOrder;
    return this;
  }

  /**
   * @internal This method is not intended to be used by consumers of this library.
   *
   * @param columnName A user-intelligible name for the column being built. Used for error messages. Should be title cased.
   */
  _build(columnName: string): TableColumn<Datum> {
    this.validateTableColumn(columnName);
    return new TableColumn({
      id: this._id,
      getSortValue: this._getSortValue,
      getFormattedValue: this._getFormattedValue,
      ascendingSortFunction: this._ascendingSortFunction,
      sortDirection: this._sortDirection,
      sortable: this._sortable,
      // activelySorted: this._activelySorted, // todo
      sortOrder: this._sortOrder,
      // sortedOnInit: this._sortedOnInit,
    });
  }

  protected validateTableColumn(columnName: string): void {
    if (!this._id) {
      throw new Error(
        `${columnName} Column: id is required. Please use method 'id' to set it.`
      );
    }
  }
}

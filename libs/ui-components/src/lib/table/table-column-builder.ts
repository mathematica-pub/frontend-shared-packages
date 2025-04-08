import {
  SortDirection,
  SortDirectionType,
  TableColumn,
  TableValue,
} from './table-column';

const DEFAULT = {
  _cssClass: '',
  _sortable: false,
  _sortedOnInit: false,
  _sortOrder: Number.MAX_SAFE_INTEGER,
  _sortDirection: SortDirection.asc,
};

/**
 * An internal builder class for a single table column.
 */
export class TableColumnBuilder<Datum> {
  private _cssClass: string;
  private _id: string;
  private _key: string;
  private _label: string;
  private _getSortValue: (x: Datum) => TableValue;
  private _ascendingSortFunction: (a: Datum, b: Datum) => number;
  private _sortDirection: SortDirectionType;
  private _sortable: boolean;
  private _sortOrder: number;

  constructor() {
    Object.assign(this, DEFAULT);
  }

  /**
   * OPTIONAL. Determines additional CSS classes to be applied to the table column.
   *
   * @param cssClass A string to use as the CSS class of the table column.
   */
  cssClass(cssClass: string): this {
    this._cssClass = cssClass;
    return this;
  }

  /**
   * REQUIRED. Determines the id of the table column.
   *
   * @param id A string to use as the id of the table column.
   */
  id(id: string): this {
    this._id = id;
    return this;
  }
  /**
   * OPTIONAL. Determines the label of the table column.
   *
   * @param label A string to use as the label of the table column.
   */
  label(label: string): this {
    this._label = label;
    return this;
  }

  /**
   * REQUIRED. Determines the property key in the datum that
   * is to be displayed in the table column.
   *
   * @param key A string to use as the display key of the table column. Nested object data
   * can be accessed using dot notation (e.g. `user.name`).
   */
  displayKey(key: string): this {
    this._key = key;
    return this;
  }

  /**
   * OPTIONAL. Specifies how to extract the datum property to be sorted
   * on for cells in the table column.
   *
   * @param getSortValue A function to extract the datum property to be
   * sorted on for cells in the table column, or `null` to not set this property.
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
   * OPTIONAL. Specifies how datum are to be sorted in ascending order for the table column.
   * If not provided, the column will use `d3.ascending` on the getSortValue output.
   *
   * @param ascendingSortFunction A function to sort datum in ascending order for the table column,
   * or `null` to not set this property.
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
   * OPTIONAL. Determines the direction to start sorting the column in.
   *
   * @param sortDirection A SortDirectionType to use as the sort direction of the table column.
   * If not called, the default value is `SortDirection.asc`.
   */
  sortDirection(sortDirection: SortDirectionType): this {
    this._sortDirection = sortDirection;
    return this;
  }

  /**
   * OPTIONAL. Determines whether the column is sortable.
   *
   * @param sortable A boolean to use as the sortable property of the table column.
   * If not called, the default value is `false`.
   */
  sortable(sortable: boolean): this {
    this._sortable = sortable;
    return this;
  }

  /**
   * OPTIONAL. Determines the sort order of the table column.
   *
   * @param sortOrder A number to use as the sort order of the table column.
   *
   * If not called, the default value is `Number.MAX_SAFE_INTEGER`.
   */
  sortOrder(sortOrder: number): this {
    this._sortOrder = sortOrder;
    return this;
  }

  /**
   * @internal Not meant to be called by consumers of the library.
   *
   * @param columnName A user-intelligible name for the column being built. Used for error messages. Should be title cased.
   */
  _build(columnName): TableColumn<Datum> {
    this.validateTableColumn(columnName);
    return new TableColumn({
      id: this._id,
      label: this._label,
      key: this._key,
      cssClass: this._cssClass,
      getSortValue: this._getSortValue,
      ascendingSortFunction: this._ascendingSortFunction,
      sortDirection: this._sortDirection,
      sortable: this._sortable,
      sortOrder: this._sortOrder,
    });
  }

  /**
   * Validates the table column properties before initializing the TableColumn instance.
   *
   * @param columnName A user-intelligible name for the column being built. Used for error messages. Should be title cased.
   */
  protected validateTableColumn(columnName: string): void {
    if (!this._id || !this._key) {
      throw new Error(`ColumnBuilder: ${columnName}. ID and key are required.`);
    }
    if (
      this._sortable &&
      !(this._ascendingSortFunction || this._getSortValue)
    ) {
      throw new Error(
        `ColumnBuilder: ${columnName}. Sortable columns must have at least one of the following fields: ascendingSortFunction or getSortValue.`
      );
    }
  }
}

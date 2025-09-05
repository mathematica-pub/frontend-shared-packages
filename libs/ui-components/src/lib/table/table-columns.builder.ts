import { TableColumn } from './table-column';
import { TableColumnBuilder } from './table-column-builder';

/**
 * User-facing builder class for a list of table columns.
 * @deprecated This class is deprecated. See `tanstack-example.component.ts` for the recommended implementation.
 */
export class TableColumnsBuilder<Datum> {
  private _columnBuilders: TableColumnBuilder<Datum>[] = [];

  /**
   * REQUIRED. Specifies a new column to be added to the end of the list of columns.
   *
   * @param columnBuilder The builder for the table column to add.
   */
  addColumn(
    applyToColumn: (
      column: TableColumnBuilder<Datum>
    ) => TableColumnBuilder<Datum>
  ): this {
    this._columnBuilders.push(applyToColumn(new TableColumnBuilder<Datum>()));
    return this;
  }

  /**
   * REQUIRED. Validates and builds the configuration object for the table columns that can be passed to `HsiUiTableDataSource`.
   *
   * The user must call this at the end of the chain of methods to build the configuration object.
   */
  getConfig(): TableColumn<Datum>[] {
    this.validateColumns();
    return this._columnBuilders.map((column, i) =>
      column.id(i.toString())._build(i)
    );
  }

  private validateColumns(): void {
    // Validation logic here
  }
}

import { TableColumn } from './table-column';
import { TableColumnBuilder } from './table-column-builder';

/**
 * User-facing builder class for a list of table columns.
 */
export class TableColumnsBuilder<Datum> {
  private _columnBuilders: TableColumnBuilder<Datum>[] = [];

  /**
   * Adds a new column to the list of columns.
   * @param columnBuilder The builder for the column to add.
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
   * Builds the list of columns.
   * @returns The list of columns built by the builder.
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

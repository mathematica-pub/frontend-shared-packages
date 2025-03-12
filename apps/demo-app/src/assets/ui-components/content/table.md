# Table Component

HSI UI Components provides a set of Angular components and configuration classes that can be used to
create tables. These components can be imported via the `TableModule`.

The HSI UI Components table uses the
[Angular Material CDK Table](https://material.angular.io/cdk/table/overview) as a reference.

## Composing a Table

A table is minimally composed of the following HTML components:

- `table` &mdash; A component that is an outer wrapper for other components in the table.
- `th` &mdash; A component that contains ...
- `td` &mdash; A component that is hidden until the user interacts with the textbox. Contains the
  options that the user can select.
- `tr` &mdash; A component that creates an option in the listbox.

In addition, the table must also be given data through an `HsiUiTableDataSource` instance.

The following is a minimal implementation:

```custom-angular
simple table
```

```html
@if (columns$ | async; as columns) {
<table cdk-table [dataSource]="dataSource" class="table-container">
  @for (column of columns; track column.id) {
  <ng-container [cdkColumnDef]="column.id">
    @if (column.sortable) {
    <th
      hsi-ui-single-sort-header
      scope="col"
      cdk-header-cell
      *cdkHeaderCellDef="let element"
      [column]="column"
      [sortIcon]="sortIcon"
      (click)="dataSource.sort(column)"
    >
      {{ column.id }}</th
    >
    } @else {
    <th cdk-header-cell *cdkHeaderCellDef="let element"> {{ column.id }} </th>
    }
    <td cdk-cell *cdkCellDef="let element"> {{ column.getFormattedValue(element) }} </td>
  </ng-container>
  }
  <tr cdk-header-row *cdkHeaderRowDef="columnIds"></tr>
  <tr cdk-row *cdkRowDef="let row; columns: columnIds"></tr>
</table>
}
```

```ts
TODO insert here
```

## Using `HsiUiTableDataSource`

## `TableColumn`

# Examples

## Example using custom icons in table header

```custom-angular
custom sort icon table
```

## Example using pipes for formatting table data

## More complex sorting examples

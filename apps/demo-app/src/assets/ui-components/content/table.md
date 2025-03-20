# Table Component

HSI UI Components provides a set of Angular components and configuration classes that can be used to
create tables. These components can be imported via the `TableModule`.

The HSI UI Components table uses the
[Angular Material CDK Table](https://material.angular.io/cdk/table/overview) as a reference.

## Composing a Table

A table is minimally composed of the following HTML components:

- `table` &mdash; A component that is an outer wrapper for other components in the table.
- `th` &mdash; A component that represents a header cell in the table.
- `td` &mdash; A component that represents a data cell in the table.
- `tr` &mdash; A component that represents a row of cells in the table.

In addition, the table must also be given data through an `HsiUiTableDataSource` instance.

The following is a minimal implementation:

```custom-angular
simple table
```

```ts
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  HsiUiTableDataSource,
  TableColumn,
  TableColumnsBuilder,
  TableModule,
} from '@hsi/ui-components';
import { distinctUntilChanged, map, Observable, of, shareReplay } from 'rxjs';

enum ColumnNames {
  fruit = 'fruit',
  color = 'color',
}

@Component({
  selector: 'app-table-example',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './table-example.component.html',
  styleUrls: ['../../../examples.scss', './table-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableExampleComponent implements OnInit {
  @Input() sortIcon: string = 'arrow_upward';
  data$: Observable<{ fruit: string; color: string }[]>;
  columns$: Observable<TableColumn<{ fruit: string; color: string }>[]>;
  dataSource: HsiUiTableDataSource<{ fruit: string; color: string }>;
  tableHeaders$: Observable<string[]>;
  constructor(private destroyRef: DestroyRef) {}

  ngOnInit(): void {
    this.setTableData();
    this.setDataSource();
    this.setTableHeaders();
  }

  setTableData() {
    this.data$ = of([
      { fruit: 'lemon', color: 'yellow' },
      { fruit: 'mango', color: 'orange' },
      { fruit: 'avocado', color: 'green' },
      { fruit: 'apple', color: 'red' },
      { fruit: 'orange', color: 'orange' },
      { fruit: 'banana', color: 'yellow' },
    ]);
    this.columns$ = of(
      new TableColumnsBuilder<{ fruit: string; color: string }>()
        .addColumn((column) =>
          column
            .label(ColumnNames.fruit)
            .ascendingSortFunction((a, b) => a.fruit.localeCompare(b.fruit))
            .sortOrder(1)
            .sortable(true)
            .sortDirection('asc') // initial sort direction
            .getFormattedValue((x) => x.fruit)
        )
        .addColumn((column) =>
          column
            .label(ColumnNames.color)
            .sortable(true)
            .ascendingSortFunction((a, b) => a.color.localeCompare(b.color))
            .getFormattedValue((x) => x.color)
        )
        .getConfig()
    );
  }
  setDataSource() {
    this.dataSource = new HsiUiTableDataSource(this.data$, this.columns$);
  }
  setTableHeaders(): void {
    this.tableHeaders$ = this.columns$.pipe(
      map((columns) => columns.map((x) => x.id)),
      distinctUntilChanged((a, b) => a.length === b.length && a.every((v, i) => v === b[i])),
      takeUntilDestroyed(this.destroyRef),
      shareReplay(1)
    );
  }
}
```

```html
@if (columns$ | async; as columns) {
<table cdk-table [dataSource]="dataSource" class="table-container">
  @for (column of columns; track column.id) {
  <ng-container [cdkColumnDef]="column.id">
    @if (column.sortable) {
    <th
      scope="col"
      cdk-header-cell
      *cdkHeaderCellDef="let element"
      (click)="dataSource.sort(column)"
    >
      <span
        [ngClass]="[
                'material-sort-icon',
                column.sortDirection,
                column.activelySorted ? 'actively-sorted' : '',
                'material-symbols-outlined',
              ]"
        [attr.aria-hidden]="true"
        >{{ sortIcon }}</span
      >
      {{ column.label }}</th
    >
    } @else {
    <th cdk-header-cell *cdkHeaderCellDef="let element"> {{ column.label }} </th>
    }
    <td cdk-cell *cdkCellDef="let element"> {{ column.getFormattedValue(element) }} </td>
  </ng-container>
  }
  <tr cdk-header-row *cdkHeaderRowDef="tableHeaders$ | async"></tr>
  <tr cdk-row *cdkRowDef="let row; columns: tableHeaders$ | async"></tr>
</table>
}
```

## Features

## Configuration

To provide a column configuration for the `HsiUiTableDataSource`, you can use the
`TableColumnsBuilder`.

**Required imports from @hsi/ui-components**

```ts
import {
  HsiUiTableDataSource,
  TableColumn,
  TableColumnsBuilder,
  TableModule,
} from '@hsi/ui-components';
...
@Component({
  ...
  imports: [
    TableModule
    ...
  ],
  ...
})
```

**Minimal example of creating a `HsiUiTableDataSource`**

```ts
...
dataSource: HsiUiTableDataSource<>;
data$: Observable<Datum[]> = of([
      { fruit: 'lemon', color: 'yellow' },
      { fruit: 'mango', color: 'orange' },
    ]);
columns$: Observable<TableColumn<Datum>[];> = of(
      new TableColumnsBuilder<{ fruit: string; color: string }>()
        .addColumn((column) =>
          column
            .label(ColumnNames.fruit)
            .getFormattedValue((x) => x.fruit)
        )
        .addColumn((column) =>
          column
            .label(ColumnNames.color)
            .getFormattedValue((x) => x.color)
        )
        .getConfig());
...
this.dataSource = new HsiUiTableDataSource(this.data$, this.columns$);
```

### Required Methods

There are no required methods for `TableColumnsBuilder`.

### Optional Methods

The `TableColumm` class contains data that states whether or not the column is sortable, and, if so,
how to sort the column.

The following methods can be called on `TableColumnsBuilder` to create a valid table columns object.

- `addColumn((column: TableColumnBuilder) => TableColumnBuilder)` - adds a column to this builder's
  list of table columns
- `getConfig()` - builds the list of table columns

### `TableColumnBuilder` Methods

#### Required Methods

- `id(id: string)` - sets the id of the table column

#### Optional Methods

- `label(label: string)` - sets the label of the table column
- `getSortValue(getSortValue: (x: Datum) => TableValue)` - sets the
- `getFormattedValue(getFormattedValue: (x: Datum) => string)` - sets the function that extracts the
  value to be sorted on for this column
- `ascendingSortFunction((a: Datum, b: Datum) => number)` - sets the function by which to sort the
  values in this column
- `sortDirection(sortDirection: SortDirectionType)` - sets the starting direction by which to sort
  this column
- `sortable(sortable: boolean)` - sets whether or not this column can be sorted
- `sortOrder(sortOrder: number)` - sets the order in which this column is to be sorted by in the
  case of tiebreaks

## Customizing with icons

Icons of the user's choice can also be included like so:

```custom-angular
custom sort icon table
```

In the `th` element:

```html
<th scope="col" cdk-header-cell *cdkHeaderCellDef="let element" (click)="dataSource.sort(column)">
  <span
    [ngClass]="[
                'material-sort-icon',
                column.sortDirection,
                column.activelySorted ? 'actively-sorted' : '',
                'material-symbols-outlined',
              ]"
    [attr.aria-hidden]="true"
    >{{ sortIcon }}</span
  >
  {{ column.label }}</th
>
```

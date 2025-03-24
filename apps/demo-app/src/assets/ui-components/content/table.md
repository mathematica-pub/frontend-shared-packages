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
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { GetValueByKeyPipe } from '@hsi/app-dev-kit';
import { HsiUiTableDataSource, TableColumnsBuilder, TableModule } from '@hsi/ui-components';
import { of } from 'rxjs';

enum ColumnNames {
  fruit = 'Fruit',
  colorName = 'Color',
  inventory = 'Inventory',
  price = 'Sell price',
}

enum FruitInfo {
  fruit = 'fruit',
  colorName = 'color',
  inventory = 'metrics.inventory',
  price = 'metrics.price',
}

class FruitType {
  fruit: string;
  color: string;
  metrics: {
    inventory: number;
    price: number;
  };
}

@Component({
  selector: 'app-table-example',
  standalone: true,
  imports: [CommonModule, TableModule, GetValueByKeyPipe],
  templateUrl: './table-example.component.html',
  styleUrls: ['../../../examples.scss', './table-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableExampleComponent implements OnInit {
  @Input() sortIcon: string = 'arrow_upward';
  dataSource: HsiUiTableDataSource<FruitType>;

  ngOnInit(): void {
    this.setTableData();
  }

  setTableData() {
    const initData$ = of([
      {
        fruit: 'lemon',
        color: 'yellow',
        metrics: { inventory: 10, price: 1.2 },
      },
      {
        fruit: 'mango',
        color: 'orange',
        metrics: { inventory: 5, price: 2.5 },
      },
      {
        fruit: 'avocado',
        color: 'green',
        metrics: { inventory: 20, price: 3.0 },
      },
      {
        fruit: 'apple',
        color: 'red',
        metrics: { inventory: 15, price: 1.5 },
      },
      {
        fruit: 'orange',
        color: 'orange',
        metrics: { inventory: 20, price: 1.8 },
      },
      {
        fruit: 'banana',
        color: 'yellow',
        metrics: { inventory: 5, price: 1.0 },
      },
    ]);
    const initColumns$ = of(
      new TableColumnsBuilder<FruitType>()
        .addColumn(
          (column) =>
            column
              .label(ColumnNames.fruit)
              .displayKey(FruitInfo.fruit)
              .ascendingSortFunction((a, b) => a.fruit.localeCompare(b.fruit))
              .sortOrder(1)
              .sortable(true)
              .sortDirection('asc') // initial sort direction
        )
        .addColumn((column) =>
          column
            .displayKey(FruitInfo.colorName)
            .label(ColumnNames.colorName)
            .sortable(true)
            .ascendingSortFunction((a, b) => a.color.localeCompare(b.color))
        )
        .addColumn((column) =>
          column
            .displayKey(FruitInfo.inventory)
            .label(ColumnNames.inventory)
            .sortable(true)
            .getSortValue((x) => x.metrics.inventory)
        )
        .getConfig()
    );
    this.dataSource = new HsiUiTableDataSource(initData$, initColumns$);
  }
}
```

```html
@if (dataSource.columns$ | async; as columns) {
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
    <td cdk-cell *cdkCellDef="let element"> {{ element | getValueByKey: column.key }} </td>
  </ng-container>
  }
  <tr cdk-header-row *cdkHeaderRowDef="dataSource.columnIds$ | async"></tr>
  <tr cdk-row *cdkRowDef="let row; columns: dataSource.columnIds$ | async"></tr>
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
        )
        .addColumn((column) =>
          column
            .label(ColumnNames.color)
        )
        .getConfig());
...
this.dataSource = new HsiUiTableDataSource(this.data$, this.columns$);
```

### Handling tiebreaks

Tiebreaks can be handled through setting a `sortOrder` on the `TableColumn` objects. When data in
cells of the column currently being sorted are of the same sort value, cell data from the inactive
columns are then compared to determine an ordering of the rows.

### `TableColumnsBuilder` Methods

#### Required Methods

There are no required methods for `TableColumnsBuilder`.

#### Optional Methods

The `TableColumm` class contains data that states whether or not the column is sortable, and, if so,
how to sort the column.

The following methods can be called on `TableColumnsBuilder` to create a list of validated
`TableColumn`s.

- `addColumn((column: TableColumnBuilder) => TableColumnBuilder)` - adds a column to this builder's
  list of table columns
- `getConfig()` - builds the list of table columns

### `TableColumnBuilder` Methods

#### Required Methods

- `id(id: string)` - sets the id of the table column
- `displayKey(key: string)` - sets the key of the table column. This is used for accessing the data
  within the given `Datum`. A key should be formatted like a path to the desired data in the object.
  See how the `metrics.cost` subkey is set in the example below.

  ```ts
  // Datum
  fruits = [{
    fruit: 'apple',
    color: 'green',
    metrics: {
      cost: 21,
      quantity: 2
    },
    ...
  }]

  // Builder
  builder = new TableColumnsBuilder<{
  fruit: string;
  color: string;
  metrics: {
    inventory: number;
    price: number;
  }
  }>()
  ...
        .addColumn(
          (column) =>
            column
              .label('Cost')
              .displayKey('metrics.cost')
        )
        ...
  ```

#### Optional Methods

- `label(label: string)` - sets the label of the table column
- `getSortValue(getSortValue: (x: Datum) => TableValue)` - sets the function that extracts the value
  to be sorted on from the datum
- `ascendingSortFunction((a: Datum, b: Datum) => number)` - sets the function by which to sort the
  values in this column
- `sortDirection(sortDirection: SortDirectionType)` - sets the starting direction by which to sort
  this column
- `sortable(sortable: boolean)` - sets whether or not this column can be sorted
- `sortOrder(sortOrder: number)` - sets the order in which this column is to be sorted by in the
  case of tiebreaks

### Accessing data values using `GetValueByKeyPipe`

In order to access data from the `Datum` objects in HTML, import the `GetValueByKeyPipe` from the
`AppDevKitModule`.

```ts
import { GetValueByKeyPipe } from '@hsi/app-dev-kit';
...
@Component({
  selector: 'app-table-example',
  standalone: true,
  imports: [CommonModule, TableModule, GetValueByKeyPipe],
  templateUrl: './table-example.component.html',
  styleUrls: ['../../../examples.scss', './table-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
...
```

The appropriate display key should then be passed to the pipe in the HTML table implementation like
so:

```html
<table cdk-table [dataSource]="dataSource" class="table-container">
  ...
  <td cdk-cell *cdkCellDef="let element"> {{ element | getValueByKey: column.key }} </td>
  ...
</table>
```

## Customizing with icons

Icons of the user's choice can also be included like so:

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

Example CSS code for styling icons:

```scss
$icon-width: 0.9rem;
$icon-left-margin: 0.2rem;
$icon-right-margin: 0.4rem;

.header-cell-sort {
  display: flex;
  align-items: flex-end;
  &:hover {
    cursor: pointer;
  }
}

.material-symbols-outlined {
  display: flex;
  justify-content: center;
  width: $icon-width;
  height: 1.2rem;
  font-size: 1.25rem;
  margin-left: $icon-left-margin;
  margin-right: $icon-right-margin;
  opacity: 0.25;
  transition: all 150ms ease-in-out;

  &:hover {
    opacity: 0.75;
  }

  &.actively-sorted {
    opacity: 1;
  }
}

.desc {
  transform: rotate(180deg);
}

.left {
  text-align: left;
}

.right {
  text-align: right;

  .header-cell-sort {
    justify-content: flex-end;
  }

  &.sorted-cell {
    padding-right: $icon-left-margin + $icon-width + $icon-right-margin;
  }
}

.center {
  text-align: center;
}
```

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
              .cssClass('left')
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
            .cssClass('left')
            .sortable(true)
            .ascendingSortFunction((a, b) => a.color.localeCompare(b.color))
        )
        .addColumn((column) =>
          column
            .displayKey(FruitInfo.inventory)
            .label(ColumnNames.inventory)
            .cssClass('right')
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
      <div [ngClass]="['header-cell-sort', column.cssClass]">
        {{ column.label }}
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
      </div></th
    >
    } @else {
    <th cdk-header-cell *cdkHeaderCellDef="let element"> {{ column.label }} </th>
    }
    <td
      [ngClass]="[
            'table-cell',
            column.cssClass,
            column.sortable ? 'sorted-cell' : '',
          ]"
      cdk-cell
      *cdkCellDef="let element"
    >
      {{ element | getValueByKey: column.key }}
    </td>
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

```builder-method
name: addColumn
description: 'Specifies a new column to be added to the end of the list of columns.'
params:
  - name: applyToColumn
    type: '(column: TableColumnBuilder<Datum>) => TableColumnBuilder<Datum>'
    description:
      - 'Table column configuration for the column to be added, with all desired builder methods applied. See required methods below in the `TableColumnBuilder` section.'
```

```builder-method
name: getConfig
description: 'Validates and builds the configuration object for the table columns that can be passed to `HsiUiTableDataSource`.'
params:
- ''
```

### `TableColumnBuilder` Methods

#### Required Methods

```builder-method
name: id
description: 'Sets the id of the table column.'
params:
  - name: id
    type: string
    description:
      - 'The assigned id of the table column.'
```

```builder-method
name: displayKey
description: 'Sets the property key in the datum that is to be displayed in the table column. See the `metrics.cost` display key is set in the example below.'
params:
  - name: key
    type: string
    description:
      - 'The display key of the table column. Nested object data can be accessed using dot notation (e.g. `metrics.cost`, `metrics.inventory`).'
```

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

```builder-method
name: label
description: 'Sets the label of the table column. Useful for storing the desired header text for the column.'
params:
  - name: label
    type: string
    description:
      - 'The label to be used by the table column.'
```

```builder-method
name: cssClass
description: 'Sets the CSS class of the table column.'
params:
  - name: cssClass
    type: string
    description:
      - 'The CSS class to be used by the table column.'
```

```builder-method
name: getSortValue
description: 'Specifies how to extract the datum property to be sorted on for cells in the table column.'
params:
  - name: getSortValue
    type: '(x: Datum) => TableValue | null'
    description:
      - 'A function to extract the datum property to be sorted on for cells in the table column, or `null` to not set this property.'
```

```builder-method
name: ascendingSortFunction
description: 'Specifies how datum are to be sorted in ascending order for the table column. If not provided, the column will use `d3.ascending` on the getSortValue output.'
params:
  - name: ascendingSortFunction
    type: '(a: Datum, b: Datum) => number | null'
    description:
      - 'The function that sorts datum in ascending order for the table column.'
```

```builder-method
name: sortDirection
description: Sets the direction the table column is sorted in.
params:
  - name: sortDirection
    type: SortDirectionType
    description:
      - 'The sort direction of the table column.'
```

```builder-method
name: sortable
description: 'Sets whether or not the table column can be sorted.'
params:
  - name: sortable
    type: boolean
    description:
      - 'Whether the column can be sorted.'
```

```builder-method
name: sortOrder
description: 'Sets the order in which the table column is to be sorted by in the case of tiebreaks'
params:
  - name: sortOrder
    type: number
    description:
      - 'The sort order of the table column.'
```

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

Example CSS code for styling icons in a table:

```scss
@use 'vars' as *;
@use 'functions' as *;
@use 'colors';
$icon-width: 0.9rem;
$icon-left-margin: 0.2rem;
$icon-right-margin: 0.4rem;

.header-cell-sort {
  display: flex;
  &:hover {
    cursor: pointer;
  }
  &.left {
    align-items: flex-start;
    justify-content: flex-start;
  }
  &.right {
    align-items: flex-end;
    justify-content: flex-end;
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

.right {
  text-align: right;
}

.left {
  text-align: left;
}

.table-cell {
  &.sorted-cell {
    padding-right: $icon-left-margin + $icon-width + $icon-right-margin;
  }
}

.table-container {
  border-spacing: 0;
  td:last-child {
    &.left {
      padding-right: 0;
    }
  }

  th:last-child {
    &.left {
      padding-right: 0;
    }
  }

  th {
    vertical-align: bottom;
    &.sorted-header {
      padding-right: 0;
    }
  }
}
```

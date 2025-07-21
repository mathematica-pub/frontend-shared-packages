# Table Component

## Simple Example

HSI UI Components employs the
[Tanstack Table library](https://tanstack.com/table/latest/docs/introduction) to create table
components. Navigate to Tanstack Table's online documentation for additional information on features
such as pagination, input fields, column filtering, etc. The basic requirements for setting up a
table using the TanStack Angular Table package are outlined below.

## Library Installation

Run the following terminal command from your project to install the most recent Tanstack Table
Angular adapter version:

```
npm install @tanstack/angular-table
```

## Composing a Table

Tanstack Table has a basic Angular table implementation
[here](https://tanstack.com/table/latest/docs/framework/angular/examples/basic).

### HTML Component Requirements

A Tanstack table is minimally composed of the following HTML components:

- `table` &mdash; A component that is an outer wrapper for other components in the table.
- `thead` &mdash; A component that represents the header of the table.
- `tbody` &mdash; A component that is a container for the content of the table.
- `tr` &mdash; A component that represents a row of cells in the table.
- `th` &mdash; A component that represents a header cell in the table (nested in the `thead`
  component).
- `td` &mdash; A component that represents a data cell in the table (nested in the `tbody`
  component).

### Table Configuration

In addition, the table must also be given data and column definitions through a `createTable`
instance, which requires column definitions and the data to be displayed in the table.

The Tanstack Table adapter requires data to be defined typically as an array of objects, with each
object representing a row of data. Additional guidance on defining table data can be found
[here](https://tanstack.com/table/latest/docs/guide/data).

```ts
// basic table data definition
type Person = {
  name: {
    first: string,
    last: string,
  };
  age: number;
}

const defaultData: Person[] = [
  {
    name: {
      first: "James",
      last: "Madison",
    },
    age: 20,
  },
  ...
]
```

The Tanstack Table adapter also requires an array of column defs. Columns defs determine what data
will be displayed and accessed in the table component. Column defs are also where you can feed
metadata pertaining to each table column, including sortability. Additional guidance on defining
table data can be found [here](https://tanstack.com/table/latest/docs/guide/column-defs).

```ts
import { ColumnDef } from '@tanstack/angular-table';
...
const columnDefs: ColumnDef<Person>[] = [
  {
    accessorFn: (row) => row.name.first,
    id: 'firstName',
    ...
  },
  {
    accessorFn: (row) => row.name.last,
    id: 'lastName',
    ...
  },
  {
    accessorKey: 'age',
    header: () => 'Age',
    ...
  },
];
```

After defining your data and column defs, create a `createAngularTable` instance. Note that the
Tanstack Angular Table adapter uses `signal` instances as opposed to Rxjs Observables. See the
example below:

```ts
import { toSignal } from '@angular/core';
import { createAngularTable } from '@tanstack/angular-table';

...
@Component({
  selector: 'app-tanstack-example',
  standalone: true,
  ...
})
export class TanstackExampleComponent {
  ...
  readonly data = toSignal(defaultData);
  table = createAngularTable(() => {
    return {
      data: data(),
      columns: columnDefs,
    };
  });
}
```

The following is a minimal implementation with sorting and embedded data visualizations from our
`viz-components` library:

```custom-angular
simple table
```

```ts
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, signal } from '@angular/core';
import {
  ChartConfig,
  LinesConfig,
  VicChartConfigBuilder,
  VicChartModule,
  VicLinesConfigBuilder,
  VicLinesModule,
  VicXQuantitativeAxisConfig,
  VicXQuantitativeAxisConfigBuilder,
  VicXyAxisModule,
  VicYQuantitativeAxisConfig,
  VicYQuantitativeAxisConfigBuilder,
} from '@hsi/viz-components';
import {
  ColumnDef,
  createAngularTable,
  FlexRenderDirective,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
} from '@tanstack/angular-table';

type PerformanceReview = {
  year: Date;
  hrAppraisal: number;
  employeeAppraisal: number;
};
type Person = {
  firstName: string;
  lastName: string;
  age: number;
  performance: PerformanceReview[];
};

type PersonWithCharts = Person & {
  chartConfig: LinesConfig<PerformanceReview>;
};

const defaultData: Person[] = [
  {
    firstName: 'first',
    lastName: 'last',
    age: 106,
    performance: [
      { year: new Date(2020, 1, 1), hrAppraisal: 9, employeeAppraisal: 4 },
      { year: new Date(2023, 1, 1), hrAppraisal: 10, employeeAppraisal: 2 },
      { year: new Date(2025, 1, 1), hrAppraisal: 10, employeeAppraisal: -10 },
    ],
  },
  {
    firstName: 'person',
    lastName: 'name',
    age: 45,
    performance: [
      { year: new Date(2020, 1, 1), hrAppraisal: 8, employeeAppraisal: 9 },
      { year: new Date(2023, 1, 1), hrAppraisal: 10, employeeAppraisal: 10 },
      { year: new Date(2025, 1, 1), hrAppraisal: 0, employeeAppraisal: 10 },
    ],
  },
  {
    firstName: 'another',
    lastName: 'name',
    age: 40,
    performance: [
      { year: new Date(2020, 1, 1), hrAppraisal: 8, employeeAppraisal: 5 },
      { year: new Date(2023, 1, 1), hrAppraisal: 6, employeeAppraisal: 3 },
      { year: new Date(2025, 1, 1), hrAppraisal: 7, employeeAppraisal: 1 },
    ],
  },
];

const defaultColumns: ColumnDef<Person>[] = [
  {
    accessorKey: 'firstName',
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
    enableSorting: false,
  },
  {
    accessorFn: (row) => row.lastName,
    id: 'lastName',
    cell: (info) => `<i>${info.getValue<string>()}</i>`,
    header: () => `Last Name`,
    footer: (info) => info.column.id,
    enableSorting: false,
  },
  {
    accessorKey: 'age',
    header: () => 'Age',
    footer: (info) => info.column.id,
    sortingFn: 'basic',
    enableSorting: true,
  },
  {
    accessorKey: 'chartConfig',
    header: () => `performance appraisal`,
    footer: (info) => info.column.id,
  },
];

@Component({
  selector: 'app-tanstack-example',
  standalone: true,
  imports: [FlexRenderDirective, CommonModule, VicChartModule, VicLinesModule, VicXyAxisModule],
  providers: [
    VicChartConfigBuilder,
    VicLinesConfigBuilder,
    VicYQuantitativeAxisConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
  ],
  templateUrl: './tanstack-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./tanstack-example.component.scss'],
})
export class TanstackExampleComponent implements OnInit {
  @Input() sortIcon: string = 'arrow_upward';
  readonly sorting = signal<SortingState>([
    {
      id: 'age',
      desc: false,
    },
  ]);

  data = signal(null);

  table = createAngularTable(() => ({
    data: this.data(),
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting: this.sorting(),
    },
    debugAll: true,
    enableSorting: true,
    onSortingChange: (updater) => {
      if (updater instanceof Function) {
        this.sorting.update(updater);
      } else {
        this.sorting.set(updater);
      }
    },
  }));

  chartConfig: ChartConfig;
  xAxisQuantitativeConfig: VicXQuantitativeAxisConfig<Date>;
  yAxisConfig: VicYQuantitativeAxisConfig<number>;

  ngOnInit(): void {
    this.data.set(this.addChartsToData(defaultData));
    this.chartConfig = new VicChartConfigBuilder().getConfig();
    this.xAxisQuantitativeConfig = new VicXQuantitativeAxisConfigBuilder()
      .ticks((ticks) => ticks.format('%Y'))
      .getConfig();
    this.yAxisConfig = new VicYQuantitativeAxisConfigBuilder().getConfig();
  }

  addChartsToData(data: Person[]): PersonWithCharts[] {
    return data.map((person) => {
      const chartConfig = new VicLinesConfigBuilder<PerformanceReview>()
        .data(person.performance)
        .xDate((xDate) => xDate.valueAccessor((d) => new Date(d.year)))
        .y((yValue) => yValue.valueAccessor((d) => d.employeeAppraisal))
        .pointMarkers((markers) => markers.radius(2).growByOnHover(3))
        .getConfig();
      return { ...person, chartConfig };
    });
  }
}
```

```html
<div class="p-2">
  <table>
    <thead>
      @for (headerGroup of table.getHeaderGroups(); track headerGroup.id) {
      <tr>
        @for (header of headerGroup.headers; track header.id) { @if (!header.isPlaceholder) { @if
        (header.column.getCanSort()) {
        <th>
          <ng-container
            *flexRender="
                      header.column.columnDef.header;
                      props: header.getContext();
                      let headerCell
                    "
          >
            <div
              class="header-cell-sort"
              (click)="header.column.toggleSorting()"
              [class.sorting-asc]="
                        header.column.getIsSorted() === 'asc'
                      "
              [class.sorting-desc]="
                        header.column.getIsSorted() === 'desc'
                      "
            >
              {{ headerCell }}
              <span
                [ngClass]="[
                          'material-sort-icon',
                          'material-symbols-outlined',
                        ]"
                [class.desc]="header.column.getIsSorted() === 'desc'"
                [class.asc]="header.column.getIsSorted() === 'asc'"
                [class.actively-sorted]="
                          header.column.getIsSorted() !== false
                        "
                [attr.aria-hidden]="true"
                >{{ sortIcon }}</span
              >
            </div>
          </ng-container>
        </th>
        } @else {
        <th>
          <ng-container
            *flexRender="
                      header.column.columnDef.header;
                      props: header.getContext();
                      let header
                    "
          >
            <div [innerHTML]="header"></div>
          </ng-container>
        </th>
        } } }
      </tr>
      }
    </thead>
    <tbody>
      <tr *ngFor="let row of table.getRowModel().rows">
        <td *ngFor="let cell of row.getVisibleCells()">
          <ng-container *ngIf="cell.column.id === 'chartConfig'; else defaultCell">
            <vic-xy-chart [config]="chartConfig">
              <ng-container svg-elements>
                <svg:g vic-xy-background></svg:g>
                <svg:g vic-primary-marks-lines [config]="$any(cell.getValue())"></svg:g>
                <svg:g vic-x-quantitative-axis [config]="xAxisQuantitativeConfig"></svg:g>
                <svg:g vic-y-quantitative-axis [config]="yAxisConfig"></svg:g>
              </ng-container>
            </vic-xy-chart>
          </ng-container>
          <ng-template #defaultCell> {{ cell.getValue() }} </ng-template>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

## Features

## Additional Table Configuration Notes

### Row Models

In order to add functionality to your Tanstack table instance, you must pass a row model to your
`createAngularTable` instance. See the Tanstack Row Models
[documentation](https://tanstack.com/table/latest/docs/guide/row-models) for futher information.

```ts
import { getCoreRowModel } from '@tanstack/angular-table';
...
const table = useAngularTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(), // row model
});
```

### Angular State

Tanstack creates and tracks an underlying state of the table component. In order to access and
further customize the table's internal state, see this
[guide](https://tanstack.com/table/latest/docs/framework/angular/guide/table-state).

### Sorting with Tanstack

Row sorting can be quickly implemented with Tanstack Table. First, define a `SortingState`. This
tracks the current state of sorting within your table. You can also pass an initial sorting state of
your `createAngularTable` instance to apply sorting to data in the table upon initialization.

```ts
import { SortingState } from '@tanstack/angular-table';
...
readonly sorting = signal<SortingState>([
  {
    id: 'age',
    desc: false,
  },
]);

```

Then, include your `SortingState` instance, a sorted row model (for client-side sorting, call
`getSortedRowModel()` to quickly create a sorted row model), and an `onSortingChange` handler in
your `createAngularTable` instance.

```ts
import {
  createAngularTable,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
} from '@tanstack/angular-table';

...
@Component({
  selector: 'app-tanstack-example',
  standalone: true,
  ...
})
export class TanstackExampleComponent {
  ...
  table = createAngularTable(() => {
    return {
      data: data(),
      columns: columnDefs,
          getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      state: {
        sorting: this.sorting(),
      },
      enableSorting: true,
      onSortingChange: (updater) => {
        if (updater instanceof Function) {
          this.sorting.update(updater);
        } else {
          this.sorting.set(updater);
        }
      },
    };
  });
}
```

In your column defs, enable sorting for a specific column by adding `enableSorting: true` to the
def's options. This is also where you can pass sorting functions for the data being represented by
the column def. Tanstack provides built-in sorting fns, such as `'alphanumeric'` and `'datetime'`.
If you do not provide a value for `sortingFn`, Tanstack will infer a sort function based on the date
type of the column. Custom sorting functions can also be created and passed to your column defs as
well.

```ts
const defaultColumns: ColumnDef<Person>[] = [
  {
    accessorKey: 'firstName',
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
    enableSorting: false, // disables for this particular column
  },
  {
    accessorKey: 'age',
    header: () => 'Age',
    footer: (info) => info.column.id,
    sortingFn: 'basic',
    enableSorting: true,
  },
  ...
];
```

In the HTML for your table component, within your `<th>` components, you can call functions such as
`toggleSorting()` and `getIsSorted()` on your column defs to sort by a particular column or get a
column's sortability:

```html
<table>
  ...
  <thead>
    ...
    <tr>
      ... @if (header.column.getCanSort()) {
      <th>
        ...
        <div
          class="header-cell-sort"
          (click)="header.column.toggleSorting()"
          [class.sorting-asc]="
                        header.column.getIsSorted() === 'asc'
                      "
          [class.sorting-desc]="
                        header.column.getIsSorted() === 'desc'
                      "
        >
          {{ headerCell }}
          <span
            [class.desc]="header.column.getIsSorted() === 'desc'"
            [class.asc]="header.column.getIsSorted() === 'asc'"
            [class.actively-sorted]="
                          header.column.getIsSorted() !== false
                        "
            >{{ sortIcon }}</span
          >
        </div>
        ...
      </th>
      }
    </tr>
    ...
  </thead>
  ...
</table>
```

For more information, see the Tanstack Table sorting documentation
[here](https://tanstack.com/table/latest/docs/guide/sorting).

## Customizing with icons

Icons of the user's choice can also be included like so:

In the `th` element:

```html
<th>
  <ng-container
    *flexRender="
      header.column.columnDef.header;
      props: header.getContext();
      let headerCell
    "
  >
    <div
      class="header-cell-sort"
      (click)="header.column.toggleSorting()"
      [class.sorting-asc]="
        header.column.getIsSorted() === 'asc'
      "
      [class.sorting-desc]="
        header.column.getIsSorted() === 'desc'
      "
    >
      {{ headerCell }}
      <span
        [ngClass]="[
          'material-sort-icon',
          'material-symbols-outlined',
        ]"
        [class.desc]="header.column.getIsSorted() === 'desc'"
        [class.asc]="header.column.getIsSorted() === 'asc'"
        [class.actively-sorted]="
          header.column.getIsSorted() !== false
        "
        [attr.aria-hidden]="true"
        >{{ sortIcon }}</span
      >
    </div>
  </ng-container>
</th>
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

## Additional Features

Tanstack Table includes additional functionality for tables, such as pagination, column filtering,
editable cell data, using signal input, etc.

- Pagination: [Documentation](https://tanstack.com/table/latest/docs/guide/pagination) |
  [Example](https://tanstack.com/table/latest/docs/framework/angular/examples/signal-input)
- Column Filtering: [Documentation](https://tanstack.com/table/latest/docs/guide/column-filtering) |
  [Example](https://tanstack.com/table/latest/docs/framework/angular/examples/filters)

### More Examples

- Creating tables with editable data cells:
  [Example](https://tanstack.com/table/latest/docs/framework/angular/examples/editable)
- Working with signal input:
  [Example](https://tanstack.com/table/latest/docs/framework/angular/examples/signal-input)

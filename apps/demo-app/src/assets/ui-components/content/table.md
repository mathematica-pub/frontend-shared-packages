# Table Component

## Simple Example

HSI UI Components employs the
[Tanstack Table library](https://tanstack.com/table/latest/docs/introduction) to create table
components. Navigate to Tanstack Table's online documentation for additional information on features
such as pagination, input fields, column filtering, etc. The basic requirements for setting up a
table using the TanStack Angular Table package are outlined below.

## Library Installation

Run the following terminal command from your project to install the most recent Angular Table
version:

```
npm install @tanstack/angular-table
```

## Composing a Table

A Tanstack table is minimally composed of the following HTML components:

- `table` &mdash; A component that is an outer wrapper for other components in the table.
- `thead` &mdash; A component that represents a header in the table.
- `tr` &mdash; A component that represents a row of cells in the table.
- `tbody` &mdash; A component that represents the in the table.

In addition, the table must also be given data through an `HsiUiTableDataSource` instance.

Tanstack Table has a basic Angular table implementation
[here](https://tanstack.com/table/latest/docs/framework/angular/examples/basic).

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
  year: number;
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
      { year: 2020, hrAppraisal: 9, employeeAppraisal: 4 },
      { year: 2023, hrAppraisal: 10, employeeAppraisal: 2 },
      { year: 2025, hrAppraisal: 10, employeeAppraisal: -10 },
    ],
  },
  {
    firstName: 'person',
    lastName: 'name',
    age: 45,
    performance: [
      { year: 2020, hrAppraisal: 8, employeeAppraisal: 9 },
      { year: 2023, hrAppraisal: 10, employeeAppraisal: 10 },
      { year: 2025, hrAppraisal: 0, employeeAppraisal: 10 },
    ],
  },
  {
    firstName: 'another',
    lastName: 'name',
    age: 40,
    performance: [
      { year: 2020, hrAppraisal: 8, employeeAppraisal: 5 },
      { year: 2023, hrAppraisal: 6, employeeAppraisal: 3 },
      { year: 2025, hrAppraisal: 7, employeeAppraisal: 1 },
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
  align-items: flex-end;
  justify-content: flex-end;
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

.table-cell {
  text-align: right;

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
...

- Pagination: Documentation | Example
- Filtering: Documentation | Example

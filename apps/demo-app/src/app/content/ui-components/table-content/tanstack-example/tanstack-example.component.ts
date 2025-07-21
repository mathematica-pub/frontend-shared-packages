import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  signal,
} from '@angular/core';
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
  imports: [
    FlexRenderDirective,
    CommonModule,
    VicChartModule,
    VicLinesModule,
    VicXyAxisModule,
  ],
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

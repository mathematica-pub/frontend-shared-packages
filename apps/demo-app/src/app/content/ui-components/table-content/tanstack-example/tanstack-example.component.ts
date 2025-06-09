import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal,
} from '@angular/core';
import {
  ColumnDef,
  createAngularTable,
  FlexRenderDirective,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
} from '@tanstack/angular-table';
import { BarsSimpleStatesExampleComponent } from '../../../viz-components/bars-content/bars-simple-states-example/bars-simple-states-example.component';

type Person = {
  firstName: string;
  lastName: string;
  age: number;
  performance: {
    visits: number;
    status: string;
    progress: number;
  };
};

const defaultData: Person[] = [
  {
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    performance: {
      visits: 100,
      status: 'In Relationship',
      progress: 50,
    },
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    performance: {
      visits: 20,
      status: 'Single',
      progress: 10,
    },
  },
  {
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    performance: {
      visits: 40,
      status: 'Single',
      progress: 80,
    },
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
    accessorKey: 'performance.visits',
    header: () => `Visits`,
    footer: (info) => info.column.id,
  },
  {
    accessorKey: 'performance.status',
    header: 'Status',
    footer: (info) => info.column.id,
    sortingFn: 'basic',
  },
  {
    accessorKey: 'performance.progress',
    header: () => `Progress`,
    footer: (info) => info.column.id,
  },
];

@Component({
  selector: 'app-tanstack-example',
  standalone: true,
  imports: [
    FlexRenderDirective,
    CommonModule,
    BarsSimpleStatesExampleComponent,
  ],
  templateUrl: './tanstack-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./tanstack-example.component.scss'],
})
export class TanstackExampleComponent {
  @Input() sortIcon: string = 'arrow_upward';
  readonly sorting = signal<SortingState>([
    {
      id: 'age',
      desc: false,
    },
  ]);

  readonly data = signal(defaultData);
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
}

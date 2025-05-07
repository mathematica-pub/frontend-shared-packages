import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  ColumnDef,
  createAngularTable,
  FlexRenderDirective,
  getCoreRowModel,
  SortingState,
} from '@tanstack/angular-table';
import { combineLatest, map, of } from 'rxjs';
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
  },
  {
    accessorFn: (row) => row.lastName,
    id: 'lastName',
    cell: (info) => `<i>${info.getValue<string>()}</i>`,
    header: () => `<span>Last Name</span>`,
    footer: (info) => info.column.id,
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
    header: () => `<span>Visits</span>`,
    footer: (info) => info.column.id,
    sortingFn: (a, b) => {
      const aValue = a.getValue('performance.visits');
      const bValue = b.getValue('performance.visits');
      return aValue - bValue;
    },
  },
  {
    accessorKey: 'performance.status',
    header: 'Status',
    footer: (info) => info.column.id,
    sortingFn: 'basic',
  },
  {
    accessorKey: 'performance.progress',
    header: () => `<span>Progress</span>`,
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
  onClick(id: string) {
    console.log('onClick', id);
  }
  readonly sorting = signal<SortingState>([
    {
      id: 'age',
      desc: false, //sort by age in descending order by default
    },
  ]);

  //Use our controlled state values to fetch data
  readonly data$ = combineLatest({
    data: of(defaultData),
=    sorting: toObservable(this.sorting),
  }).pipe(map(({ data, sorting }) => updateData(data, sorting)));

  readonly data = toSignal(this.data$);
  table = createAngularTable(() => ({
    data: this.data(),
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      sorting: this.sorting(),
    },
    enableSorting: true,
    manualSorting: true,
    onSortingChange: (updater) => {
      if (updater instanceof Function) {
        this.sorting.update(updater);
      } else {
        this.sorting.set(updater);
      }
    },
  }));
}
function updateData(data: Person[], sorting: SortingState): Person[] {
  if (sorting.length === 0) return data;

  const { id, desc } = sorting[0];
  return data.sort((a, b) => {
    const aValue = id.split('.').reduce((obj, key) => obj[key], a);
    const bValue = id.split('.').reduce((obj, key) => obj[key], b);

    if (aValue < bValue) return desc ? 1 : -1;
    if (aValue > bValue) return desc ? -1 : 1;
    return 0;
  });
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortDirection, TableColumn } from '../table-column';
import { TableComponent } from '../table.component';
import { SingleSortHeaderComponent } from './single-sort-header.component';

describe('SingleSortHeaderComponent', () => {
  let component: SingleSortHeaderComponent<any>;
  let fixture: ComponentFixture<SingleSortHeaderComponent<any>>;
  let column: TableColumn<{ name: string }>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SingleSortHeaderComponent],
      providers: [TableComponent],
    });
    fixture = TestBed.createComponent(SingleSortHeaderComponent);
    component = fixture.componentInstance;
    column = new TableColumn<{ name: string }>({
      getFormattedValue: (x) => x.name,
      sortDirection: SortDirection.asc,
      label: 'name',
    });
    component.column = column;
    component.sortIcon = 'sortIcon';
  });

  describe('getColumnSortClasses', () => {
    it('should return sort classes - case: is actively sorted', () => {
      component.column = new TableColumn<{ name: string }>({
        label: 'test',
        getFormattedValue: (x) => x.name,
        sortDirection: SortDirection.asc,
        activelySorted: true,
      });
      const classes = component.getColumnSortClasses();
      expect(classes).toEqual([
        'material-symbols-outlined',
        'asc',
        'actively-sorted',
      ]);
    });
    it('should return sort classes - case: is not actively sorted', () => {
      component.column = {
        name: 'test',
        sortDirection: SortDirection.asc,
        activelySorted: false,
      } as any;
      const classes = component.getColumnSortClasses();
      expect(classes).toEqual(['material-symbols-outlined', 'asc']);
    });
  });
});

/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { of, tap } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { SortDirection, TableColumn } from './table-column';
import { HsiUiTableDataSource } from './table.data-source';

describe('DataSource', () => {
  let testScheduler: TestScheduler;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    testScheduler = new TestScheduler((actual, expected) => {
      return expect(actual).toEqual(expected);
    });
  });

  describe('integration test: single sort column', () => {
    it('correctly sorts data', () => {
      const originalData = [
        { name: 'a', tiebreak: 0 },
        { name: 'a', tiebreak: 1 },
        { name: 'b', tiebreak: 0 },
        { name: 'd', tiebreak: 1 },
        { name: 'd', tiebreak: 0 },
      ];
      const chosenColumn = new TableColumn<{
        name: string;
        tiebreak: number;
      }>({
        getSortValue: (x) => x.name,
        sortDirection: SortDirection.asc,
        sortable: true,
        id: 'name',
        sortOrder: 1,
      });
      const dataSource = new HsiUiTableDataSource(
        of(originalData),
        of([
          chosenColumn,
          new TableColumn<{
            name: string;
            tiebreak: number;
          }>({
            getSortValue: (x) => x.tiebreak,
            sortOrder: 2,
          }),
        ])
      );
      const connection$ = dataSource.connect();
      const ascData = [
        { name: 'a', tiebreak: 0 },
        { name: 'a', tiebreak: 1 },
        { name: 'b', tiebreak: 0 },
        { name: 'd', tiebreak: 0 },
        { name: 'd', tiebreak: 1 },
      ];

      const descData = [
        { name: 'd', tiebreak: 0 },
        { name: 'd', tiebreak: 1 },
        { name: 'b', tiebreak: 0 },
        { name: 'a', tiebreak: 0 },
        { name: 'a', tiebreak: 1 },
      ];

      const expectedMarbles = 'abc';
      const triggerMarbles = ' -xy|';
      const expectedValues = {
        a: originalData, // correctly emits non-sorted data on first emission
        b: ascData, // sorts correctly
        c: descData, // flips correctly
      };
      const triggerValues = {
        x: () => dataSource.sort(chosenColumn),
        y: () => dataSource.sort(chosenColumn),
      };
      testScheduler.run(({ expectObservable, cold }) => {
        expectObservable(connection$).toBe(expectedMarbles, expectedValues);
        expectObservable(
          cold(triggerMarbles, triggerValues).pipe(tap((fn) => fn()))
        );
      });
    });
  });
});

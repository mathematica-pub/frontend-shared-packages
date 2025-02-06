// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { CdkTable } from '@angular/cdk/table';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { of, tap } from 'rxjs';
// import { TestScheduler } from 'rxjs/testing';
// import { SortDirection, TableColumn } from './table-column';

// describe('TableComponent', () => {
//   let component: CdkTable<any>;
//   let fixture: ComponentFixture<CdkTable<any>>;
//   let testScheduler: TestScheduler;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       declarations: [CdkTable],
//     });
//     fixture = TestBed.createComponent(CdkTable);
//     testScheduler = new TestScheduler((actual, expected) => {
//       return expect(actual).toEqual(expected);
//     });
//     component = fixture.componentInstance;
//   });

//   describe('ngOnInit', () => {
//     beforeEach(() => {
//       spyOn(component, 'setTableData');
//       spyOn(component, 'setTableHeaders');
//       spyOn(component, 'validateRowHeaders');
//     });
//     it('should call setTableData', () => {
//       component.ngOnInit();
//       expect(component.setTableData).toHaveBeenCalled();
//     });
//     it('should call setTableHeaders', () => {
//       component.ngOnInit();
//       expect(component.setTableHeaders).toHaveBeenCalled();
//     });
//     it('should call validateRowHeaders', () => {
//       component.ngOnInit();
//       expect(component.validateRowHeaders).toHaveBeenCalled();
//     });
//   });

//   describe('sortTableByColumn', () => {
//     it('should emit column', () => {
//       spyOn(component.sort, 'next');
//       const column = { name: 'test', sort: SortDirection.asc };
//       component.sortTableByColumn(column as any);
//       expect(component.sort.next).toHaveBeenCalledWith(column as any);
//     });
//   });

//   describe('integration test: single sort column', () => {
//     it('correctly sorts data', () => {
//       const originalData = [
//         { name: 'a', tiebreak: 0 },
//         { name: 'a', tiebreak: 1 },
//         { name: 'b', tiebreak: 0 },
//         { name: 'd', tiebreak: 1 },
//         { name: 'd', tiebreak: 0 },
//       ];
//       const chosenColumn = new TableColumn<{
//         name: string;
//         tiebreak: number;
//       }>({
//         getSortValue: (x) => x.name,
//         sortDirection: SortDirection.asc,
//         id: 'name',
//         sortOrder: 1,
//       });
//       const columns = [
//         chosenColumn,
//         new TableColumn<{
//           name: string;
//           tiebreak: number;
//         }>({
//           getSortValue: (x) => x.tiebreak,
//           sortDirection: SortDirection.asc,
//           sortOrder: 2,
//         }),
//       ];
//       component.config$ = of({ data: originalData, columns: columns });
//       component.ngOnInit();

//       const ascData = [
//         { name: 'a', tiebreak: 0 },
//         { name: 'a', tiebreak: 1 },
//         { name: 'b', tiebreak: 0 },
//         { name: 'd', tiebreak: 0 },
//         { name: 'd', tiebreak: 1 },
//       ];

//       const descData = [
//         { name: 'd', tiebreak: 0 },
//         { name: 'd', tiebreak: 1 },
//         { name: 'b', tiebreak: 0 },
//         { name: 'a', tiebreak: 0 },
//         { name: 'a', tiebreak: 1 },
//       ];

//       const expectedMarbles = 'abc';
//       const triggerMarbles = ' -xy|';
//       const expectedValues = {
//         a: ascData, // correctly emits sorted data on first emission
//         b: descData, // flips correctly
//         c: ascData, // flops correctly
//       };
//       const triggerValues = {
//         x: () => component.sortTableByColumn(chosenColumn),
//         y: () => component.sortTableByColumn(chosenColumn),
//       };

//       testScheduler.run(({ expectObservable, cold }) => {
//         expectObservable(component.data$).toBe(expectedMarbles, expectedValues);
//         expectObservable(
//           cold(triggerMarbles, triggerValues).pipe(tap((fn) => fn()))
//         );
//       });
//     });
//   });
// });

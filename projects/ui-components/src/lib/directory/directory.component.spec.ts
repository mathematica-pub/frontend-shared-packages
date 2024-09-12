/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgOnChangesUtilities } from 'projects/app-dev-kit/src/public-api';
import { DirectoryComponent } from './directory.component';

describe('DirectoryComponent', () => {
  let component: DirectoryComponent;
  let fixture: ComponentFixture<DirectoryComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [DirectoryComponent],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnChanges', () => {
    let changesSpy: jasmine.Spy;
    beforeEach(() => {
      changesSpy = spyOn(NgOnChangesUtilities, 'inputObjectChanged');
      spyOn(component.state, 'next');
    });
    describe('when selection changes', () => {
      it('should update state', () => {
        changesSpy.and.returnValue(true);
        component.selection = {
          activePath: 'activePath',
          selectedItem: 'selectedItem',
        };
        component.ngOnChanges({
          selection: { currentValue: component.selection },
        } as any);
        expect(component.state.next).toHaveBeenCalledOnceWith(
          component.selection
        );
      });
    });
  });

  describe('toggleOpen', () => {
    it('should set open[key] to true if open[key] is undefined', () => {
      component.open = {};
      component.toggleOpen('apple');
      expect(component.open['apple']).toEqual(true);
    });

    it('should toggle open[key] value if open[key] is defined', () => {
      component.open = { apple: true };
      component.toggleOpen('apple');
      expect(component.open['apple']).toEqual(false);
    });
  });
});

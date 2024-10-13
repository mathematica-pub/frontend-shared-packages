/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgOnChangesUtilities } from '@hsi/app-dev-kit';
import { HsiUiDirectoryComponent } from './directory.component';

describe('DirectoryComponent', () => {
  let component: HsiUiDirectoryComponent;
  let fixture: ComponentFixture<HsiUiDirectoryComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HsiUiDirectoryComponent],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(HsiUiDirectoryComponent);
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

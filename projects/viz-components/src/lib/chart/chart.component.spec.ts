/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgOnChangesUtilities } from '../core/utilities/ng-on-changes';
import { ChartComponent } from './chart.component';

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
  });

  describe('ngOnChanges()', () => {
    let changedSpy: jasmine.Spy;
    beforeEach(() => {
      spyOn(component, 'setAspectRatio');
      spyOn((component as any)._height, 'next');
      spyOn((component as any)._margin, 'next');
      component.height = 80;
      component.margin = 'margin' as any;
      changedSpy = spyOn(
        NgOnChangesUtilities,
        'inputObjectChangedNotFirstTime'
      );
    });
    it('calls setAspectRatio if height changed', () => {
      changedSpy.and.returnValues(true, false, false);
      component.ngOnChanges({ height: 100 } as any);
      expect(component.setAspectRatio).toHaveBeenCalledTimes(1);
    });
    it('calls next on heightSubject if height changed', () => {
      changedSpy.and.returnValues(true, false, false);
      component.ngOnChanges({ height: 100 } as any);
      expect((component as any)._height.next).toHaveBeenCalledOnceWith(80);
    });
    it('calls setAspectRatio if width changed', () => {
      changedSpy.and.returnValues(false, true, false);
      component.ngOnChanges({ width: 100 } as any);
      expect(component.setAspectRatio).toHaveBeenCalledTimes(1);
    });
    it('calls next on marginSubject if margin changed', () => {
      changedSpy.and.returnValues(false, false, true);
      component.ngOnChanges({ margin: 'margin' } as any);
      expect((component as any)._margin.next).toHaveBeenCalledOnceWith(
        'margin'
      );
    });
  });

  describe('ngOnInit()', () => {
    beforeEach(() => {
      spyOn(component as any, 'setAspectRatio');
      spyOn(component as any, 'createDimensionObservables');
    });

    it('calls setAspectRatio', () => {
      component.ngOnInit();
      expect((component as any).setAspectRatio).toHaveBeenCalledTimes(1);
    });

    it('calls createDimensionObservables', () => {
      component.ngOnInit();
      expect(
        (component as any).createDimensionObservables
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('setAspectRatio()', () => {
    it('sets aspectRatio to the correct value', () => {
      component.width = 100;
      component.height = 50;
      component.setAspectRatio();
      expect(component.aspectRatio).toBe(2);
    });
  });
});

/* eslint-disable  @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XyChartComponent } from './xy-chart.component';

describe('XyChartComponent', () => {
  let component: XyChartComponent;
  let fixture: ComponentFixture<XyChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [XyChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XyChartComponent);
    component = fixture.componentInstance;
  });

  describe('updateXScale', () => {
    it('calls next on updateXScale', () => {
      spyOn((component as any).xScale, 'next');
      component.updateXScale({});
      expect((component as any).xScale.next).toHaveBeenCalledOnceWith({});
    });
  });

  describe('updateYScale', () => {
    it('calls next on updateYScale', () => {
      spyOn((component as any).yScale, 'next');
      component.updateYScale({});
      expect((component as any).yScale.next).toHaveBeenCalledOnceWith({});
    });
  });

  describe('updateCategoryScale', () => {
    it('calls next on updateCategoryScale', () => {
      spyOn((component as any).categoryScale, 'next');
      component.updateCategoryScale({});
      expect((component as any).categoryScale.next).toHaveBeenCalledOnceWith(
        {}
      );
    });
  });
});

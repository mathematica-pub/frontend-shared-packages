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

  describe('updateScales', () => {
    beforeEach(() => {
      (component as any).scales.next({ x: 1, y: 2, category: 3 } as any);
    });
    it('calls next on scales', () => {
      spyOn((component as any).scales, 'next');
      component.updateScales({ x: 4 } as any);
      expect((component as any).scales.next).toHaveBeenCalledOnceWith({
        x: 4,
        y: 2,
        category: 3,
      } as any);
    });
  });
});

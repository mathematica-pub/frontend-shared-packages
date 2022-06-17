import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XYChartSpaceComponent } from './xy-chart-space.component';

describe('XYChartSpaceComponent', () => {
  let component: XYChartSpaceComponent;
  let fixture: ComponentFixture<XYChartSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [XYChartSpaceComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XYChartSpaceComponent);
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
});

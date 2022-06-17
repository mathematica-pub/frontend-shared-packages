import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XyChartSpaceComponent } from './xy-chart-space.component';

describe('XyChartSpaceComponent', () => {
  let component: XyChartSpaceComponent;
  let fixture: ComponentFixture<XyChartSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [XyChartSpaceComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XyChartSpaceComponent);
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

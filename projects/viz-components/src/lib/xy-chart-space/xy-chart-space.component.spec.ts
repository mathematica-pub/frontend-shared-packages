import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartComponent } from '../chart/chart.component';
import { XYChartSpaceComponent } from './xy-chart-space.component';

describe('XYChartSpaceComponent', () => {
  let component: XYChartSpaceComponent;
  let fixture: ComponentFixture<XYChartSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [XYChartSpaceComponent],
      providers: [ChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XYChartSpaceComponent);
    component = fixture.componentInstance;
  });

  describe('ngAfterContentInit()', () => {
    let setAndDrawSpy: jasmine.Spy;
    beforeEach(() => {
      setAndDrawSpy = jasmine.createSpy('setMethodsFromConfigAndDraw');
      component.dataMarksComponent = {
        setMethodsFromConfigAndDraw: setAndDrawSpy,
      } as any;
    });
    it('calls setMethodsFromConfigAndDraw on each chartMark component if chartMark components exits', () => {
      component.ngAfterContentInit();
      expect(setAndDrawSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateXScale', () => {
    it('calls next on updateXScale', () => {
      spyOn(component.xScale, 'next');
      component.updateXScale({});
      expect(component.xScale.next).toHaveBeenCalledOnceWith({});
    });
  });

  describe('updateYScale', () => {
    it('calls next on updateYScale', () => {
      spyOn(component.yScale, 'next');
      component.updateYScale({});
      expect(component.yScale.next).toHaveBeenCalledOnceWith({});
    });
  });
});

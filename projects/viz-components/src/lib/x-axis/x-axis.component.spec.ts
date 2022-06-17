import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { ChartComponent } from '../chart/chart.component';
import { XYChartSpaceComponent } from '../xy-chart-space/xy-chart-space.component';
import { XAxisComponent } from './x-axis.component';

describe('XAxisComponent', () => {
  let component: XAxisComponent;
  let fixture: ComponentFixture<XAxisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [XAxisComponent],
      providers: [ChartComponent, XYChartSpaceComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XAxisComponent);
    component = fixture.componentInstance;
    component.chart.dataMarksComponent = {
      config: { showTooltip: false },
    } as any;
  });

  describe('subscribeToScale', () => {
    let updateSpy: jasmine.Spy;
    beforeEach(() => {
      component.xySpace = {
        xScale: new BehaviorSubject<any>(null),
      } as any;
      component.xySpace.xScale$ = (
        component.xySpace as any
      ).xScale.asObservable();
      component.scale = 'no scale';
      component.axis = 'none';
      updateSpy = spyOn(component, 'updateAxis');
    });
    it('sets scale to the newly emitted value', () => {
      component.subscribeToScale();
      (component.xySpace as any).xScale.next('new scale' as any);
      expect(component.scale).toEqual('new scale' as any);
    });

    it('sets calls updateAxis once', () => {
      component.subscribeToScale();
      updateSpy.calls.reset();
      (component.xySpace as any).xScale.next('new scale');
      expect(component.updateAxis).toHaveBeenCalledTimes(1);
    });
  });
});

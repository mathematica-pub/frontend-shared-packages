import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { ChartComponent } from '../chart/chart.component';
import { XYChartSpaceComponent } from '../xy-chart-space/xy-chart-space.component';
import { YAxisComponent } from './y-axis.component';

describe('YAxisComponent', () => {
  let component: YAxisComponent;
  let fixture: ComponentFixture<YAxisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [YAxisComponent],
      providers: [ChartComponent, XYChartSpaceComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YAxisComponent);
    component = fixture.componentInstance;
    component.chart.dataMarksComponent = {
      config: { showTooltip: false },
    } as any;
  });

  describe('subscribeToScale', () => {
    let updateSpy: jasmine.Spy;
    beforeEach(() => {
      component.xySpace = {
        yScale: new BehaviorSubject<any>(null),
      } as any;
      component.xySpace.yScale$ = (
        component.xySpace as any
      ).yScale.asObservable();
      component.scale = 'no scale yet' as any;
      component.axis = 'none';
      updateSpy = spyOn(component, 'updateAxis');
    });
    it('sets scale to the newly emitted value', () => {
      component.subscribeToScale();
      (component.xySpace as any).yScale.next('new scale' as any);
      expect(component.scale).toEqual('new scale' as any);
    });

    it('sets calls updateAxis with the emitted scale value', () => {
      component.subscribeToScale();
      updateSpy.calls.reset();
      (component.xySpace as any).yScale.next('new scale');
      expect(component.updateAxis).toHaveBeenCalledTimes(1);
    });
  });
});

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
  });

  describe('ngOnInit', () => {
    it('calls subscribeToAxis once', () => {
      spyOn(component, 'subscribeToScale');
      component.ngOnInit();
      expect(component.subscribeToScale).toHaveBeenCalledTimes(1);
    });
  });

  describe('subscribeToScale', () => {
    let updateSpy: jasmine.Spy;
    beforeEach(() => {
      component.xySpace = {
        yScale: new BehaviorSubject<any>(null),
      } as any;
      component.xySpace.yScale$ = component.xySpace.yScale.asObservable();
      component.scale = 'no scale yet' as any;
      component.axis = 'none';
      updateSpy = spyOn(component, 'updateAxis');
    });
    it('sets scale to the newly emitted value', () => {
      component.subscribeToScale();
      component.xySpace.yScale.next('new scale' as any);
      expect(component.scale).toEqual('new scale' as any);
    });

    it('sets calls updateAxis with the emitted scale value', () => {
      component.subscribeToScale();
      updateSpy.calls.reset();
      component.xySpace.yScale.next('new scale');
      expect(component.updateAxis).toHaveBeenCalledTimes(1);
    });
  });

  describe('setTranslate()', () => {
    beforeEach(() => {
      component.side = 'left';
      component.translate = 0;
      component.chart = {
        margin: {
          left: 10,
          right: 20,
        },
        getScaledWidth: jasmine
          .createSpy('getScaledWidth')
          .and.returnValue(100),
      } as any;
    });
    it('sets translate to chart.margin.left if side is left', () => {
      component.setTranslate();
      expect(component.translate).toEqual(10);
    });

    it('sets translate to the correct value if side is not left', () => {
      component.side = 'right';
      component.setTranslate();
      expect(component.translate).toEqual(80);
    });
  });
});

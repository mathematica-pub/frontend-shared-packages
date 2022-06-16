import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartComponent } from '../chart/chart.component';
import { XYChartSpaceComponent } from '../xy-chart-space/xy-chart-space.component';
import { GroupedBarsComponent } from './grouped-bars.component';

describe('GroupedBarsComponent', () => {
  let component: GroupedBarsComponent;
  let fixture: ComponentFixture<GroupedBarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupedBarsComponent],
      providers: [XYChartSpaceComponent, ChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupedBarsComponent);
    component = fixture.componentInstance;
    component.chart.dataMarksComponent = {
      config: { showTooltip: false },
    } as any;
  });

  describe('setMethodsFromConfigAndDraw()', () => {
    beforeEach(() => {
      spyOn(component, 'setValueArrays');
      spyOn(component, 'initNonQuantitativeDomains');
      spyOn(component, 'setValueIndicies');
      spyOn(component, 'setHasBarsWithNegativeValues');
      spyOn(component, 'initQuantitativeDomain');
      spyOn(component, 'initCategoryScale');
      spyOn(component, 'initRanges');
      spyOn(component, 'setScaledSpaceProperties');
      spyOn(component, 'setGroupScale');
      spyOn(component, 'drawMarks');
      component.config = { transitionDuration: 200 } as any;
      component.setMethodsFromConfigAndDraw();
    });

    it('calls setValueArrays once', () => {
      expect(component.setValueArrays).toHaveBeenCalledTimes(1);
    });

    it('calls initNonQuantitativeDomains once', () => {
      expect(component.initNonQuantitativeDomains).toHaveBeenCalledTimes(1);
    });

    it('calls setValueArrayIndicies once', () => {
      expect(component.setValueIndicies).toHaveBeenCalledTimes(1);
    });

    it('calls setHasBarsWithNegativeValues once', () => {
      expect(component.setHasBarsWithNegativeValues).toHaveBeenCalledTimes(1);
    });

    it('calls initQuantitativeDomain once', () => {
      expect(component.initQuantitativeDomain).toHaveBeenCalledTimes(1);
    });

    it('calls initRanges once', () => {
      expect(component.initRanges).toHaveBeenCalledTimes(1);
    });

    it('calls setScaledSpaceProperties once', () => {
      expect(component.setScaledSpaceProperties).toHaveBeenCalledTimes(1);
    });

    it('calls setGroupScale once', () => {
      expect(component.setGroupScale).toHaveBeenCalledTimes(1);
    });

    it('calls drawMarks once with the correct argument', () => {
      expect(component.drawMarks).toHaveBeenCalledOnceWith(200);
    });
  });
});

/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XyChartComponent } from '../xy-chart/xy-chart.component';
import { StackedAreaComponent } from './stacked-area.component';
import { VicStackedAreaConfig } from './stacked-area.config';

describe('StackedAreaComponent', () => {
  let component: StackedAreaComponent<any, string>;
  let fixture: ComponentFixture<StackedAreaComponent<any, string>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StackedAreaComponent],
      providers: [XyChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StackedAreaComponent<any, string>);
    component = fixture.componentInstance;
    component.config = new VicStackedAreaConfig();
  });

  describe('setPropertiesFromConfig()', () => {
    beforeEach(() => {
      spyOn(component, 'setDimensionPropertiesFromData');
      spyOn(component, 'setValueIndicies');
      spyOn(component, 'setSeries');
      spyOn(component, 'initQuantitativeDomainFromStack');
      component.setPropertiesFromData();
    });
    it('calls setDimensionPropertiesFromData once', () => {
      expect(component.setDimensionPropertiesFromData).toHaveBeenCalledTimes(1);
    });
    it('calls setValueIndicies once', () => {
      expect(component.setValueIndicies).toHaveBeenCalledTimes(1);
    });
    it('calls setSeries once', () => {
      expect(component.setSeries).toHaveBeenCalledTimes(1);
    });
    it('calls initQuantitativeDomainFromStack once', () => {
      expect(component.initQuantitativeDomainFromStack).toHaveBeenCalledTimes(
        1
      );
    });
  });
});

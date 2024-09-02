/* eslint-disable @typescript-eslint/no-explicit-any */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XyChartComponent } from '../xy-chart/xy-chart.component';
import { QuantitativeRulesComponent } from './quantitative-rules.component';

describe('QuantitativeRulesComponent', () => {
  let component: QuantitativeRulesComponent<any>;
  let fixture: ComponentFixture<QuantitativeRulesComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [QuantitativeRulesComponent],
      providers: [XyChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuantitativeRulesComponent);
    component = fixture.componentInstance;
  });

  describe('drawMarks()', () => {
    beforeEach(() => {
      spyOn(component, 'getTransitionDuration').and.returnValue(50);
      spyOn(component, 'drawRules');
      spyOn(component, 'drawLabels');
      component.config = {
        data: [1, 2, 3],
        labels: true,
      } as any;
    });
    it('calls getTransitionDuration once', () => {
      component.drawMarks();
      expect(component.getTransitionDuration).toHaveBeenCalledTimes(1);
    });
    it('calls drawRules once with transitionDuration', () => {
      component.drawMarks();
      expect(component.drawRules).toHaveBeenCalledOnceWith(50);
    });
    it('calls drawLabels once with transitionDuration if config.labels is truthy', () => {
      component.drawMarks();
      expect(component.drawLabels).toHaveBeenCalledOnceWith(50);
    });
  });
});

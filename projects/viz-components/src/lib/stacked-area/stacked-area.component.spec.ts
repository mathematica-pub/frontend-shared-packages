import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XyChartComponent } from '../xy-chart/xy-chart.component';

import { NgOnChangesUtilities } from '../core/utilities/ng-on-changes';
import { StackedAreaComponent } from './stacked-area.component';
import { VicStackedAreaConfig } from './stacked-area.config';

describe('StackedAreaComponent', () => {
  let component: StackedAreaComponent;
  let fixture: ComponentFixture<StackedAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StackedAreaComponent],
      providers: [XyChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StackedAreaComponent);
    component = fixture.componentInstance;
    component.config = new VicStackedAreaConfig();
  });

  describe('ngOnChanges()', () => {
    let configChange: any;
    let changesSpy: jasmine.Spy;
    beforeEach(() => {
      spyOn(component, 'setMethodsFromConfigAndDraw');
      changesSpy = spyOn(
        NgOnChangesUtilities,
        'inputObjectChangedNotFirstTime'
      );
      configChange = {
        config: new SimpleChange('', '', false),
      };
    });

    it('should call ngInputObjectChangedNotFirstTime once and with the correct parameters', () => {
      component.ngOnChanges(configChange);
      expect(
        NgOnChangesUtilities.inputObjectChangedNotFirstTime
      ).toHaveBeenCalledOnceWith(configChange, 'config');
    });
    it('should call setMethodsFromConfigAndDraw once if objectOnNgChangesNotFirstTime returns true', () => {
      changesSpy.and.returnValue(true);
      component.ngOnChanges(configChange);
      expect(component.setMethodsFromConfigAndDraw).toHaveBeenCalledTimes(1);
    });
    it('should call setMethodsFromConfigAndDraw once if objectOnNgChangesNotFirstTime returns false', () => {
      changesSpy.and.returnValue(false);
      component.ngOnChanges(configChange);
      expect(component.setMethodsFromConfigAndDraw).toHaveBeenCalledTimes(0);
    });
  });

  describe('ngOnInit()', () => {
    beforeEach(() => {
      spyOn(component, 'subscribeToRanges');
      spyOn(component, 'subscribeToScales');
      spyOn(component, 'setMethodsFromConfigAndDraw');
    });
    it('calls subscribeToRanges once', () => {
      component.ngOnInit();
      expect(component.subscribeToRanges).toHaveBeenCalledTimes(1);
    });

    it('calls subscribeToScales once', () => {
      component.ngOnInit();
      expect(component.subscribeToScales).toHaveBeenCalledTimes(1);
    });

    it('calls setMethodsFromConfigAndDraw once', () => {
      component.ngOnInit();
      expect(component.setMethodsFromConfigAndDraw).toHaveBeenCalledTimes(1);
    });
  });

  describe('setMethodsFromConfigAndDraw()', () => {
    beforeEach(() => {
      spyOn(component, 'setValueArrays');
      spyOn(component, 'initXAndCategoryDomains');
      spyOn(component, 'setValueIndicies');
      spyOn(component, 'setSeries');
      spyOn(component, 'initYDomain');
      spyOn(component, 'setScaledSpaceProperties');
      spyOn(component, 'initCategoryScale');
      spyOn(component, 'setArea');
      spyOn(component, 'drawMarks');
      component.chart = { transitionDuration: 200 } as any;
      component.setMethodsFromConfigAndDraw();
    });
    it('calls setValueArrays once', () => {
      expect(component.setValueArrays).toHaveBeenCalledTimes(1);
    });

    it('calls initDomains once', () => {
      expect(component.initXAndCategoryDomains).toHaveBeenCalledTimes(1);
    });

    it('calls setValueIndicies once', () => {
      expect(component.setValueIndicies).toHaveBeenCalledTimes(1);
    });

    it('calls setSeries once', () => {
      expect(component.setSeries).toHaveBeenCalledTimes(1);
    });

    it('calls initYDomain once', () => {
      expect(component.initYDomain).toHaveBeenCalledTimes(1);
    });

    it('calls setScaledSpaceProperties once', () => {
      expect(component.setScaledSpaceProperties).toHaveBeenCalledTimes(1);
    });

    it('calls initCategoryScale once', () => {
      expect(component.initCategoryScale).toHaveBeenCalledTimes(1);
    });

    it('calls setArea once', () => {
      expect(component.setArea).toHaveBeenCalledTimes(1);
    });

    it('calls drawMarks once with the correct argument', () => {
      expect(component.drawMarks).toHaveBeenCalledOnceWith(200);
    });
  });

  describe('resizeMarks()', () => {
    beforeEach(() => {
      spyOn(component, 'setScaledSpaceProperties');
      spyOn(component, 'setArea');
      spyOn(component, 'drawMarks');
      component.values = {
        x: 'x',
        y: 'y',
      } as any;
      component.resizeMarks();
    });

    it('calls setScaledSpaceProperties once', () => {
      expect(component.setScaledSpaceProperties).toHaveBeenCalledTimes(1);
    });

    it('calls setArea once', () => {
      expect(component.setArea).toHaveBeenCalledTimes(1);
    });

    it('calls drawMarks once with zero as the argument', () => {
      expect(component.drawMarks).toHaveBeenCalledOnceWith(0);
    });
  });
});

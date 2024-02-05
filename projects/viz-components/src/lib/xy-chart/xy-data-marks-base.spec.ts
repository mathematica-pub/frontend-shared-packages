/* eslint-disable  @typescript-eslint/no-explicit-any */
import { SimpleChange } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { NgOnChangesUtilities } from '../core/utilities/ng-on-changes';
import { MainServiceStub } from '../testing/stubs/services/main.service.stub';
import { XyChartComponentStub } from '../testing/stubs/xy-chart.component.stub';
import { XyDataMarksBaseStub } from '../testing/stubs/xy-data-marks-base.stub';
import { XyChartComponent } from './xy-chart.component';

describe('XyDataMarksBase abstract class', () => {
  let abstractClass: XyDataMarksBaseStub;
  let mainServiceStub: MainServiceStub;

  beforeEach(() => {
    mainServiceStub = new MainServiceStub();
    TestBed.configureTestingModule({
      providers: [
        XyDataMarksBaseStub,
        {
          provide: XyChartComponent,
          useValue: XyChartComponentStub,
        },
      ],
    });
    abstractClass = TestBed.inject(XyDataMarksBaseStub);
  });

  describe('ngOnChanges()', () => {
    let configChange: any;
    let changeSpy: jasmine.Spy;
    beforeEach(() => {
      spyOn(abstractClass, 'initFromConfig');
      changeSpy = spyOn(NgOnChangesUtilities, 'inputObjectChangedNotFirstTime');
      configChange = {
        config: new SimpleChange('', '', false),
      };
    });

    it('should call inputObjectChangedNotFirstTime once and with the correct parameters', () => {
      abstractClass.ngOnChanges(configChange);
      expect(
        NgOnChangesUtilities.inputObjectChangedNotFirstTime
      ).toHaveBeenCalledOnceWith(configChange, 'config');
    });
    it('should call initFromConfig once if objectOnNgChangesNotFirstTime returns true', () => {
      changeSpy.and.returnValue(true);
      abstractClass.ngOnChanges(configChange);
      expect(abstractClass.initFromConfig).toHaveBeenCalledTimes(1);
    });
    it('should call not call initFromConfig if objectOnNgChangesNotFirstTime returns false', () => {
      changeSpy.and.returnValue(false);
      abstractClass.ngOnChanges(configChange);
      expect(abstractClass.initFromConfig).toHaveBeenCalledTimes(0);
    });
  });

  describe('ngOnInit()', () => {
    beforeEach(() => {
      spyOn(abstractClass, 'subscribeToRanges');
      spyOn(abstractClass, 'subscribeToScales');
      spyOn(abstractClass, 'initFromConfig');
    });
    it('calls subscribeToRanges()', () => {
      abstractClass.ngOnInit();
      expect(abstractClass.subscribeToRanges).toHaveBeenCalledTimes(1);
    });
    it('calls subscribeToScales()', () => {
      abstractClass.ngOnInit();
      expect(abstractClass.subscribeToScales).toHaveBeenCalledTimes(1);
    });
    it('calls initFromConfig()', () => {
      abstractClass.ngOnInit();
      expect(abstractClass.initFromConfig).toHaveBeenCalledTimes(1);
    });
  });

  describe('initFromConfig()', () => {
    beforeEach(() => {
      spyOn(abstractClass, 'setPropertiesFromConfig');
      spyOn(abstractClass, 'setChartScalesFromRanges');
    });
    it('calls setPropertiesFromConfig()', () => {
      abstractClass.initFromConfig();
      expect(abstractClass.setPropertiesFromConfig).toHaveBeenCalledTimes(1);
    });
    it('calls setChartScales with useTransition = true', () => {
      abstractClass.initFromConfig();
      expect(abstractClass.setChartScalesFromRanges).toHaveBeenCalledOnceWith(
        true
      );
    });
  });

  describe('subscribeToRanges', () => {
    let resizeSpy: jasmine.Spy;
    beforeEach(() => {
      abstractClass.chart = {
        ranges: new BehaviorSubject<any>(null),
      } as any;
      abstractClass.chart.ranges$ = (
        abstractClass.chart as any
      ).ranges.asObservable();
      resizeSpy = spyOn(abstractClass, 'resizeMarks');
    });

    it('sets ranges to the emitted value from the subscription', () => {
      abstractClass.subscribeToRanges();
      (abstractClass.chart as any).ranges.next('test ranges');
      expect(abstractClass.ranges).toEqual('test ranges' as any);
    });

    describe('if scales are defined and all required scales are defined', () => {
      beforeEach(() => {
        abstractClass.scales = {
          x: 'test x',
          y: 'test y',
          category: 'test category',
        } as any;
        abstractClass.requiredScales = ['x', 'y', 'category'];
      });
      it('calls resizeMarks once with the correct values', () => {
        abstractClass.subscribeToRanges();
        resizeSpy.calls.reset();
        (abstractClass.chart as any).ranges.next('test range');
        expect(abstractClass.resizeMarks).toHaveBeenCalledTimes(1);
      });
    });

    describe('if scales are not defined', () => {
      beforeEach(() => {
        abstractClass.scales = null;
        abstractClass.requiredScales = ['x', 'y', 'category'];
      });
      it('does not call resizeMarks', () => {
        abstractClass.subscribeToRanges();
        resizeSpy.calls.reset();
        (abstractClass.chart as any).ranges.next('test range');
        expect(abstractClass.resizeMarks).not.toHaveBeenCalled();
      });
    });

    describe('if not all required scales are defined', () => {
      beforeEach(() => {
        abstractClass.scales = {
          x: 'test x',
          y: 'test y',
          category: null,
        } as any;
        abstractClass.requiredScales = ['x', 'y', 'category'];
      });
      it('does not call resizeMarks', () => {
        abstractClass.subscribeToRanges();
        resizeSpy.calls.reset();
        (abstractClass.chart as any).ranges.next('test range');
        expect(abstractClass.resizeMarks).not.toHaveBeenCalled();
      });
    });
  });

  describe('subscribeToScales()', () => {
    beforeEach(() => {
      abstractClass.chart = {
        scales: new BehaviorSubject<any>(null),
      } as any;
      abstractClass.chart.scales$ = (
        abstractClass.chart as any
      ).scales.asObservable();
      spyOn(abstractClass, 'drawMarks');
    });

    describe('if scales are defined', () => {
      beforeEach(() => {
        abstractClass.scales = 'test scales' as any;
      });
      it('sets scales to the emitted value from the subscription', () => {
        abstractClass.subscribeToScales();
        (abstractClass.chart as any).scales.next('test scales');
        expect(abstractClass.scales).toEqual('test scales' as any);
      });
      it('calls drawMarks once with the correct values', () => {
        abstractClass.subscribeToScales();
        (abstractClass.chart as any).scales.next('test scales');
        expect(abstractClass.drawMarks).toHaveBeenCalledTimes(1);
      });
    });

    describe('if scales are not defined', () => {
      it('does not call drawMarks', () => {
        abstractClass.subscribeToScales();
        expect(abstractClass.drawMarks).not.toHaveBeenCalled();
      });
      it('does not set scales', () => {
        abstractClass.subscribeToScales();
        expect(abstractClass.scales).toBeUndefined();
      });
    });
  });

  describe('resizeMarks()', () => {
    it('calls setChartScales once with the correct values', () => {
      spyOn(abstractClass, 'setChartScalesFromRanges');
      abstractClass.resizeMarks();
      expect(abstractClass.setChartScalesFromRanges).toHaveBeenCalledOnceWith(
        false
      );
    });
  });

  describe('getTransitionDuration', () => {
    beforeEach(() => {
      abstractClass.chart.transitionDuration = 123;
    });
    it('returns chart.transitionDuration if useTransition is true', () => {
      abstractClass.scales = {
        useTransition: true,
      } as any;
      expect(abstractClass.getTransitionDuration()).toEqual(123);
    });
    it('returns 0 if useTransition is false', () => {
      abstractClass.scales = {
        useTransition: false,
      } as any;
      expect(abstractClass.getTransitionDuration()).toEqual(0);
    });
  });
});

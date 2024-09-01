/* eslint-disable  @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { XyChartComponentStub } from '../testing/stubs/xy-chart.component.stub';
import { XyDataMarksStub } from '../testing/stubs/xy-data-marks.stub';
import { XyChartComponent } from '../xy-chart/xy-chart.component';

describe('XyDataMarks abstract class', () => {
  let abstractClass: XyDataMarksStub<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        XyDataMarksStub,
        {
          provide: XyChartComponent,
          useValue: XyChartComponentStub,
        },
      ],
    });
    abstractClass = TestBed.inject(XyDataMarksStub);
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

  describe('subscribeToRanges', () => {
    let setPropertiesFromRangesSpy: jasmine.Spy;
    beforeEach(() => {
      abstractClass.chart = {
        ranges: new BehaviorSubject<any>(null),
      } as any;
      abstractClass.chart.ranges$ = (
        abstractClass.chart as any
      ).ranges.asObservable();
      setPropertiesFromRangesSpy = spyOn(
        abstractClass,
        'setPropertiesFromRanges'
      );
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
          categorical: 'test category',
        } as any;
        abstractClass.requiredScales = ['x', 'y', 'categorical'];
      });
      it('calls setPropertiesFromRanges once with the correct values', () => {
        abstractClass.subscribeToRanges();
        setPropertiesFromRangesSpy.calls.reset();
        (abstractClass.chart as any).ranges.next('test range');
        expect(abstractClass.setChartScalesFromRanges).toHaveBeenCalledTimes(1);
      });
    });

    describe('if scales are not defined', () => {
      beforeEach(() => {
        abstractClass.scales = null;
        abstractClass.requiredScales = ['x', 'y', 'categorical'];
      });
      it('does not call setPropertiesFromRanges', () => {
        abstractClass.subscribeToRanges();
        setPropertiesFromRangesSpy.calls.reset();
        (abstractClass.chart as any).ranges.next('test range');
        expect(abstractClass.setChartScalesFromRanges).not.toHaveBeenCalled();
      });
    });

    describe('if not all required scales are defined', () => {
      beforeEach(() => {
        abstractClass.scales = {
          x: 'test x',
          y: 'test y',
          categorical: null,
        } as any;
        abstractClass.requiredScales = ['x', 'y', 'categorical'];
      });
      it('does not call setPropertiesFromRanges', () => {
        abstractClass.subscribeToRanges();
        setPropertiesFromRangesSpy.calls.reset();
        (abstractClass.chart as any).ranges.next('test range');
        expect(abstractClass.setChartScalesFromRanges).not.toHaveBeenCalled();
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

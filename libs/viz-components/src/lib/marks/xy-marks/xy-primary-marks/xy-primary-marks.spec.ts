/* eslint-disable  @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { XyChartComponent } from '../../../charts/xy-chart/xy-chart.component';
import { XyChartComponentStub } from '../../../testing/stubs/xy-chart.component.stub';
import { XyPrimaryMarksStub } from '../../../testing/stubs/xy-data-marks.stub';

describe('XyPrimaryMarks abstract class', () => {
  let abstractClass: XyPrimaryMarksStub<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        XyPrimaryMarksStub,
        {
          provide: XyChartComponent,
          useValue: XyChartComponentStub,
        },
      ],
    });
    abstractClass = TestBed.inject(XyPrimaryMarksStub);
  });

  describe('ngOnInit()', () => {
    beforeEach(() => {
      spyOn(abstractClass, 'subscribeToRanges');
      spyOn(abstractClass, 'subscribeToScales');
    });
    it('calls subscribeToRanges()', () => {
      abstractClass.ngOnInit();
      expect(abstractClass.subscribeToRanges).toHaveBeenCalledTimes(1);
    });
    it('calls subscribeToScales()', () => {
      abstractClass.ngOnInit();
      expect(abstractClass.subscribeToScales).toHaveBeenCalledTimes(1);
    });
  });

  describe('subscribeToRanges', () => {
    let setChartScalesFromRangesSpy: jasmine.Spy;
    beforeEach(() => {
      abstractClass.chart = {
        ranges: new BehaviorSubject<any>(null),
      } as any;
      abstractClass.chart.ranges$ = (
        abstractClass.chart as any
      ).ranges.asObservable();
      setChartScalesFromRangesSpy = spyOn(
        abstractClass,
        'setChartScalesFromRanges'
      );
      spyOn(abstractClass, 'initFromConfig');
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
        } as any;
        abstractClass.requiredScales = ['x', 'y'];
      });
      it('calls setPropertiesFromRanges once with the correct values', () => {
        abstractClass.subscribeToRanges();
        setChartScalesFromRangesSpy.calls.reset();
        (abstractClass.chart as any).ranges.next('test range');
        expect(abstractClass.setChartScalesFromRanges).toHaveBeenCalledTimes(1);
      });
    });

    describe('if scales are not defined', () => {
      beforeEach(() => {
        abstractClass.scales = null as any;
        abstractClass.requiredScales = ['x', 'y'];
      });
      it('does not call setPropertiesFromRanges', () => {
        abstractClass.subscribeToRanges();
        setChartScalesFromRangesSpy.calls.reset();
        (abstractClass.chart as any).ranges.next('test range');
        expect(abstractClass.setChartScalesFromRanges).not.toHaveBeenCalled();
      });
      it('calls initFromConfig', () => {
        abstractClass.subscribeToRanges();
        expect(abstractClass.initFromConfig).toHaveBeenCalledTimes(1);
      });
    });

    describe('if not all required scales are defined', () => {
      beforeEach(() => {
        abstractClass.scales = {
          x: 'test x',
          y: null,
        } as any;
        abstractClass.requiredScales = ['x', 'y'];
      });
      it('does not call setPropertiesFromRanges', () => {
        abstractClass.subscribeToRanges();
        setChartScalesFromRangesSpy.calls.reset();
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

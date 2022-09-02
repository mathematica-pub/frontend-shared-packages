/* eslint-disable  @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { XyChartComponentStub } from '../testing/stubs/xy-chart.component.stub';
import { XyContentStub } from '../testing/stubs/xy-content.stub';
import { XyChartComponent } from './xy-chart.component';

describe('XyContent abstract class', () => {
  let abstractClass: XyContentStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        XyContentStub,
        {
          provide: XyChartComponent,
          useValue: XyChartComponentStub,
        },
      ],
    });
    abstractClass = TestBed.inject(XyContentStub);
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

    it('calls resizeMarks once with the correct values when a new range is emitted from subscription if xScale and yScale are defined', () => {
      abstractClass.xScale = 'test xScale';
      abstractClass.yScale = 'test yScale';
      abstractClass.subscribeToRanges();
      resizeSpy.calls.reset();
      (abstractClass.chart as any).ranges.next('test range');
      expect(abstractClass.resizeMarks).toHaveBeenCalledTimes(1);
    });

    it('does not call resizeMarks if xScale is not defined', () => {
      abstractClass.yScale = 'test yScale';
      abstractClass.subscribeToRanges();
      resizeSpy.calls.reset();
      (abstractClass.chart as any).ranges.next('test range');
      expect(abstractClass.resizeMarks).not.toHaveBeenCalled();
    });

    it('does not call resizeMarks if yScale is not defined', () => {
      abstractClass.xScale = 'test xScale';
      abstractClass.subscribeToRanges();
      resizeSpy.calls.reset();
      (abstractClass.chart as any).ranges.next('test range');
      expect(abstractClass.resizeMarks).not.toHaveBeenCalled();
    });
  });

  describe('subscribeToScales()', () => {
    beforeEach(() => {
      abstractClass.chart = {
        xScale: new BehaviorSubject<string>(null),
        yScale: new BehaviorSubject<string>(null),
        categoryScale: new BehaviorSubject<string>(null),
      } as any;
      abstractClass.chart.xScale$ = (
        abstractClass.chart as any
      ).xScale.asObservable();
      abstractClass.chart.yScale$ = (
        abstractClass.chart as any
      ).yScale.asObservable();
      abstractClass.chart.categoryScale$ = (
        abstractClass.chart as any
      ).categoryScale.asObservable();
    });
    it('sets xScale to a new value when a new value is emitted from subscription', () => {
      abstractClass.subscribeToScales();
      expect(abstractClass.xScale).toBeNull();
      (abstractClass.chart as any).xScale.next('test x');
      expect(abstractClass.xScale).toEqual('test x');
    });

    it('sets yScale to a new value when a new value is emitted from subscription', () => {
      abstractClass.subscribeToScales();
      expect(abstractClass.yScale).toBeNull();
      (abstractClass.chart as any).yScale.next('test y');
      expect(abstractClass.yScale).toEqual('test y');
    });

    it('sets categoryScale to a new value when a new value is emitted from subscription', () => {
      abstractClass.subscribeToScales();
      expect(abstractClass.categoryScale).toBeNull();
      (abstractClass.chart as any).categoryScale.next('test cat');
      expect(abstractClass.categoryScale).toEqual('test cat');
    });
  });
});

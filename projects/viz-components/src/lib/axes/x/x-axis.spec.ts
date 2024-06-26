/* eslint-disable @typescript-eslint/no-explicit-any */
import { axisBottom, axisTop } from 'd3';
import { BehaviorSubject, of, take } from 'rxjs';
import { Ranges } from '../../chart/chart.component';
import { Vic } from '../../config/vic';
import { VicSide } from '../../core/types/layout';
import { DestroyRefStub } from '../../testing/stubs/core/destroy-ref.stub';
import { XAxisStub } from '../../testing/stubs/x-axis.stub';
import { XyChartComponentStub } from '../../testing/stubs/xy-chart.component.stub';

describe('the XAxis mixin', () => {
  let abstractClass: XAxisStub<number>;
  let chart: XyChartComponentStub;
  let testRanges: Ranges;

  beforeEach(() => {
    chart = new XyChartComponentStub();
    abstractClass = new XAxisStub(chart as any, new DestroyRefStub());
    testRanges = { x: [0, 10], y: [20, 50] } as Ranges;
  });

  describe('setTranslate()', () => {
    const rangesBS = new BehaviorSubject<Ranges>(null);
    beforeEach(() => {
      abstractClass.chart = {
        ranges$: rangesBS.asObservable(),
      } as any;
      spyOn(abstractClass, 'getTranslateDistance').and.returnValue(90);
      rangesBS.next(testRanges);
      abstractClass.setTranslate();
    });
    it('calls getTranslateDistance once', () => {
      abstractClass.translate$
        .subscribe(() => {
          expect(abstractClass.getTranslateDistance).toHaveBeenCalledOnceWith(
            testRanges
          );
        })
        .unsubscribe();
    });
    it('returns the correct string', () => {
      abstractClass.translate$
        .subscribe((str) => {
          expect(str).toBe('translate(0, 90)');
        })
        .unsubscribe();
    });
  });

  describe('getTranslateDistance', () => {
    beforeEach(() => {
      spyOn(abstractClass, 'getTopTranslate').and.returnValue(90);
      spyOn(abstractClass, 'getBottomTranslate').and.returnValue(60);
      abstractClass.config = Vic.axisXQuantitative({
        side: VicSide.top,
      });
    });
    it('returns the correct value for the top side', () => {
      abstractClass.config = Vic.axisXQuantitative({
        side: VicSide.top,
      });
      expect(abstractClass.getTranslateDistance(testRanges)).toBe(90);
    });
    it('returns the correct value for the bottom side', () => {
      abstractClass.config = Vic.axisXQuantitative({
        side: VicSide.bottom,
      });
      expect(abstractClass.getTranslateDistance(testRanges)).toBe(60);
    });
  });

  describe('getTopTranslate', () => {
    it('returns the correct value', () => {
      expect(abstractClass.getTopTranslate(testRanges)).toEqual(50);
    });
  });

  describe('getBottomTranslate', () => {
    it('returns the correct value', () => {
      abstractClass.chart = {
        margin: { top: 40 },
      } as any;
      expect(abstractClass.getBottomTranslate(testRanges)).toEqual(10);
    });
  });

  describe('getScale', () => {
    it('returns the correct scale', () => {
      const scales = {
        x: 'hello',
        useTransition: false,
        y: 'something else',
      } as any;
      abstractClass.chart.scales$ = of(scales);
      const result$ = abstractClass.getScale();
      result$.pipe(take(1)).subscribe((scale) => {
        expect(scale).toEqual({
          scale: 'hello' as any,
          useTransition: false,
        });
      });
    });
  });

  describe('setAxisFunction', () => {
    it('sets the axis function to the correct value if side is top', () => {
      abstractClass.config = Vic.axisXQuantitative({
        side: VicSide.top,
      });
      abstractClass.setAxisFunction();
      expect(abstractClass.axisFunction).toEqual(axisTop);
    });

    it('sets the axis function to the correct value if side is bottom', () => {
      abstractClass.config = Vic.axisXQuantitative({
        side: VicSide.bottom,
      });
      abstractClass.setAxisFunction();
      expect(abstractClass.axisFunction).toEqual(axisBottom);
    });
  });
});

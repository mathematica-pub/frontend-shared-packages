import { axisBottom, axisTop } from 'd3';
import { BehaviorSubject } from 'rxjs';
import { Ranges } from '../../chart/chart.model';
import { ChartComponentStub } from '../../testing/stubs/components/chart.component.stub';
import { XAxisStub } from '../../testing/stubs/x-axis.stub';
import { XyChartSpaceComponent } from '../../xy-chart-space/xy-chart-space.component';

describe('the XAxis mixin', () => {
  let abstractClass: XAxisStub;
  let chart: ChartComponentStub;
  let xySpace: XyChartSpaceComponent;
  let testRanges: Ranges;

  beforeEach(() => {
    chart = new ChartComponentStub();
    xySpace = new XyChartSpaceComponent();
    abstractClass = new XAxisStub(chart as any, xySpace);
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
        .subscribe((str) => {
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
    });
    it('returns the correct value for the top side', () => {
      abstractClass.side = 'top';
      expect(abstractClass.getTranslateDistance(testRanges)).toBe(90);
    });

    it('returns the correct value for the bottom side', () => {
      abstractClass.side = 'bottom';
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

  describe('setScale', () => {
    it('calls subscribeToScale with the correct scale', () => {
      spyOn(abstractClass, 'subscribeToScale');
      abstractClass.xySpace.xScale$ = 'hello' as any;
      abstractClass.setScale();
      expect(abstractClass.subscribeToScale).toHaveBeenCalledWith(
        'hello' as any
      );
    });
  });

  describe('setAxisFunction', () => {
    it('sets the axis function to the correct value if side is top', () => {
      abstractClass.side = 'top';
      abstractClass.setAxisFunction();
      expect(abstractClass.axisFunction).toEqual(axisTop);
    });

    it('sets the axis function to the correct value if side is bottom', () => {
      abstractClass.side = 'bottom';
      abstractClass.setAxisFunction();
      expect(abstractClass.axisFunction).toEqual(axisBottom);
    });
  });

  describe('initNumTicks', () => {
    it('sets the numTicks to the correct value', () => {
      abstractClass.chart = { width: 400 } as any;
      expect(abstractClass.initNumTicks()).toEqual(10);
    });
  });
});

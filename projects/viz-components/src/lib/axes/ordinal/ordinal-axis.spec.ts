import { ChartComponentStub } from '../../testing/stubs/components/chart.component.stub';
import { OrdinalAxisStub } from '../../testing/stubs/ordinal-axis.stub';
import { XyChartSpaceComponent } from '../../xy-chart-space/xy-chart-space.component';

describe('the OrdinalAxis mixin', () => {
  let abstractClass: OrdinalAxisStub;
  let chart: ChartComponentStub;
  let xySpace: XyChartSpaceComponent;

  beforeEach(() => {
    chart = new ChartComponentStub();
    xySpace = new XyChartSpaceComponent();
    abstractClass = new OrdinalAxisStub(chart as any, xySpace);
  });

  describe('setAxis()', () => {
    let tickSizeOuterSpy: jasmine.Spy;
    let axisFunction: (...args: any[]) => any;
    beforeEach(() => {
      tickSizeOuterSpy = jasmine
        .createSpy('tickSizeOuter')
        .and.returnValue('tick size' as any);
      axisFunction = (scale: any) => {
        return {
          tickSizeOuter: tickSizeOuterSpy,
        };
      };
      abstractClass.scale = 'class scale' as any;
      abstractClass.defaultTickSizeOuter = 3;
      abstractClass.config = {
        tickSizeOuter: 6,
      } as any;
    });
    it('calls tickSizeOuter once with the correct value', () => {
      abstractClass.setAxis(axisFunction);
      expect(tickSizeOuterSpy).toHaveBeenCalledOnceWith(6);
    });
  });
});

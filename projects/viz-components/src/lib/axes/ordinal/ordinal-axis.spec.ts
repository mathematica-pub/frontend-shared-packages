/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vic } from '../../config/vic';
import { DestroyRefStub } from '../../testing/stubs/core/destroy-ref.stub';
import { OrdinalAxisStub } from '../../testing/stubs/ordinal-axis.stub';
import { XyChartComponentStub } from '../../testing/stubs/xy-chart.component.stub';

describe('the OrdinalAxis mixin', () => {
  let abstractClass: OrdinalAxisStub<string>;
  let chart: XyChartComponentStub;

  beforeEach(() => {
    chart = new XyChartComponentStub();
    abstractClass = new OrdinalAxisStub(chart as any, new DestroyRefStub());
  });

  describe('setAxis()', () => {
    let tickSizeOuterSpy: jasmine.Spy;
    let axisFunction: (...args: any[]) => any;
    beforeEach(() => {
      tickSizeOuterSpy = jasmine
        .createSpy('tickSizeOuter')
        .and.returnValue('tick size' as any);
      axisFunction = () => {
        return {
          tickSizeOuter: tickSizeOuterSpy,
        };
      };
      abstractClass.scale = 'class scale' as any;
      abstractClass.config = Vic.axisXOrdinal({
        tickSizeOuter: 3,
      });
    });
    it('calls tickSizeOuter once with the correct value', () => {
      abstractClass.setAxis(axisFunction);
      expect(tickSizeOuterSpy).toHaveBeenCalledOnceWith(3);
    });
  });
});

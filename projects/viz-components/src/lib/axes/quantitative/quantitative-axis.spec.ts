import { timeMonth } from 'd3';
import { DestroyRefStub } from '../../testing/stubs/core/destroy-ref.stub';
import { QuantitativeAxisStub } from '../../testing/stubs/quantitative-axis.stub';
import { XyChartComponentStub } from '../../testing/stubs/xy-chart.component.stub';

describe('the QuantitativeAxis mixin', () => {
  let abstractClass: QuantitativeAxisStub;
  let chart: XyChartComponentStub;

  beforeEach(() => {
    chart = new XyChartComponentStub();
    abstractClass = new QuantitativeAxisStub(
      chart as any,
      new DestroyRefStub()
    );
  });

  describe('setAxis()', () => {
    let axisFnSpy: jasmine.Spy;
    beforeEach(() => {
      axisFnSpy = jasmine
        .createSpy('axisFunction')
        .and.returnValue('a scale' as any);
      spyOn(abstractClass as any, 'setTicks');
      abstractClass.scale = 'class scale' as any;
      abstractClass.defaultTickFormat = '0f';
      abstractClass.config = {
        tickFormat: 'a format',
      } as any;
    });
    it('calls axisFunction once with the correct value', () => {
      abstractClass.setAxis(axisFnSpy);
      expect(axisFnSpy).toHaveBeenCalledOnceWith('class scale');
    });

    it('calls sets axis to the correct value', () => {
      abstractClass.setAxis(axisFnSpy);
      expect(abstractClass.axis).toEqual('a scale');
    });

    it('calls setTicks once with tickFormat on config if that exists', () => {
      abstractClass.setAxis(axisFnSpy);
      expect((abstractClass as any).setTicks).toHaveBeenCalledOnceWith(
        'a format'
      );
    });

    it('calls setTicks once with defaultTickFormat is there is no tickFormat on config', () => {
      (abstractClass as any).config = {};
      abstractClass.setAxis(axisFnSpy);
      expect((abstractClass as any).setTicks).toHaveBeenCalledOnceWith('0f');
    });
  });

  describe('setTicks', () => {
    beforeEach(() => {
      spyOn(abstractClass as any, 'setSpecifiedTickValues');
      spyOn(abstractClass as any, 'setUnspecifiedTickValues');
    });
    describe('if tickValues exists on config', () => {
      it('calls setSpecifiedTickValues once with the correct value', () => {
        abstractClass.config = {
          tickValues: [1, 2, 3],
        } as any;
        (abstractClass as any).setTicks('format');
        expect(
          (abstractClass as any).setSpecifiedTickValues
        ).toHaveBeenCalledOnceWith('format');
      });
    });

    describe('if tickValues does not exist on config', () => {
      it('calls setUnspecifiedTickValues once with the correct value', () => {
        abstractClass.config = {} as any;
        (abstractClass as any).setTicks('format');
        expect(
          (abstractClass as any).setUnspecifiedTickValues
        ).toHaveBeenCalledOnceWith('format');
      });
    });
  });

  describe('setSpecifiedTickValues', () => {
    let tickValuesSpy: jasmine.Spy;
    let tickFormatSpy: jasmine.Spy;
    const tickFormat = '%Y';
    beforeEach(() => {
      spyOn(abstractClass as any, 'getValidTickValues').and.returnValue([
        1, 2, 3,
      ]);
      tickValuesSpy = jasmine.createSpy('tickValues');
      tickFormatSpy = jasmine.createSpy('tickFormat');
      abstractClass.axis = {
        tickValues: tickValuesSpy,
        tickFormat: tickFormatSpy,
      };
      (abstractClass as any).setSpecifiedTickValues(tickFormat);
    });
    it('calls getValidTickValues once', () => {
      expect((abstractClass as any).getValidTickValues).toHaveBeenCalledTimes(
        1
      );
    });
    it('calls tickValues on axis with the correct values', () => {
      expect(tickValuesSpy).toHaveBeenCalledOnceWith([1, 2, 3]);
    });
    it('calls tickFormat on axis with the correct values', () => {
      expect(tickFormatSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getValidTickValues', () => {
    let domainSpy: jasmine.Spy;
    beforeEach(() => {
      domainSpy = jasmine.createSpy('domain');
      abstractClass.scale = {
        domain: domainSpy.and.returnValue([0, 5]),
      };
    });
    it('returns the original tickValues if all values are within the scale domain', () => {
      abstractClass.config = {
        tickValues: [0, 2, 4, 5],
      } as any;
      expect((abstractClass as any).getValidTickValues()).toEqual([0, 2, 4, 5]);
    });
    it('returns only values that are within the scale domain', () => {
      abstractClass.config = {
        tickValues: [-1, 0, 1, 2, 3, 4, 5, 6],
      } as any;
      expect((abstractClass as any).getValidTickValues()).toEqual([
        0, 1, 2, 3, 4, 5,
      ]);
    });
  });

  describe('setUnspecifiedTickValues', () => {
    let ticksSpy: jasmine.Spy;
    let tickFormatSpy: jasmine.Spy;
    const tickFormat = '%Y';
    beforeEach(() => {
      spyOn(abstractClass as any, 'getValidNumTicks').and.returnValue(10);
      ticksSpy = jasmine.createSpy('ticks');
      tickFormatSpy = jasmine.createSpy('tickFormat');
      abstractClass.axis = {
        ticks: ticksSpy,
        tickFormat: tickFormatSpy,
      };
      (abstractClass as any).setUnspecifiedTickValues(tickFormat);
    });
    it('calls getValidatedNumTicks once', () => {
      expect((abstractClass as any).getValidNumTicks).toHaveBeenCalledOnceWith(
        tickFormat
      );
    });
    it('calls ticks on axis with the correct values', () => {
      tickFormatSpy.calls.reset();
      expect(ticksSpy).toHaveBeenCalledOnceWith(10);
    });
    it('calls tickFormat on axis with the correct values', () => {
      ticksSpy.calls.reset();
      expect(tickFormatSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getValidNumTicks', () => {
    let tickFormat: string | ((value: number | Date) => string);
    let getNumTicksSpy: jasmine.Spy;
    beforeEach(() => {
      getNumTicksSpy = spyOn(
        abstractClass as any,
        'getNumTicks'
      ).and.returnValue(8);
      spyOn(
        abstractClass as any,
        'getValidNumTicksForStringFormatter'
      ).and.returnValue(10);
      abstractClass.config = {
        numTicks: 1,
      } as any;
      spyOn(abstractClass as any, 'warnThatNoTickValidationsWereMade');
    });

    it('calls getNumTicks once', () => {
      tickFormat = ',.0f';
      (abstractClass as any).getValidNumTicks(tickFormat);
      expect((abstractClass as any).getNumTicks).toHaveBeenCalledTimes(1);
    });

    describe('if tickFormat is a string but has no period in it', () => {
      beforeEach(() => {
        tickFormat = ',f';
      });
      it('calls warnThatNoTickValidationsWereMade once', () => {
        (abstractClass as any).getValidNumTicks(tickFormat);
        expect(
          (abstractClass as any).warnThatNoTickValidationsWereMade
        ).toHaveBeenCalledTimes(1);
      });
      it('returns the result from getNumTicks', () => {
        expect((abstractClass as any).getValidNumTicks(tickFormat)).toEqual(8);
      });
    });

    describe('if tickFormat is a string with a period in it and return value from getNumTicks is a number', () => {
      beforeEach(() => {
        tickFormat = ',.0f';
      });
      it('calls getValidNumTicksStringFormatter once with the correct values', () => {
        (abstractClass as any).getValidNumTicks(tickFormat);
        expect(
          (abstractClass as any).getValidNumTicksForStringFormatter
        ).toHaveBeenCalledOnceWith(8, tickFormat);
      });
      it('returns the result from getValidNumTicksStringFormatter', () => {
        expect((abstractClass as any).getValidNumTicks(tickFormat)).toEqual(10);
      });
    });

    describe('if tickFormat is not a string', () => {
      it('returns the result from getNumTicks', () => {
        tickFormat = () => '2';
        expect((abstractClass as any).getValidNumTicks(tickFormat)).toEqual(8);
      });
    });

    describe('if result from initNumTicks is not a number', () => {
      it('returns the result from initNumTicks', () => {
        getNumTicksSpy.and.returnValue(timeMonth);
        tickFormat = ',.0f';
        expect((abstractClass as any).getValidNumTicks(tickFormat)).toEqual(
          timeMonth
        );
      });
    });
  });

  describe('getNumTicks', () => {
    beforeEach(() => {
      spyOn(abstractClass as any, 'initNumTicks').and.returnValue(10);
    });
    it('returns the value from config.numTicks if it exists', () => {
      abstractClass.config = {
        numTicks: 1,
      } as any;
      expect((abstractClass as any).getNumTicks()).toEqual(1);
    });

    it('returns the result from initNumTicks if config.numTicks does not exist', () => {
      abstractClass.config = {} as any;
      expect((abstractClass as any).getNumTicks()).toEqual(10);
    });
  });

  describe('getValidNumTicksForStringFormatter', () => {
    let domainSpy: jasmine.Spy;
    beforeEach(() => {
      domainSpy = jasmine.createSpy('domain');
    });
    it('returns 1 if the first possible tick is greater than the end of the domain', () => {
      abstractClass.scale = {
        domain: domainSpy.and.returnValue([0, 0.5]),
      };
      expect(
        (abstractClass as any).getValidNumTicksForStringFormatter(10, ',.0f')
      ).toEqual(1);
    });
    it('returns the correct value if formatter is for ints and numTicks is too big given domain max', () => {
      abstractClass.scale = {
        domain: domainSpy.and.returnValue([0, 5]),
      };
      expect(
        (abstractClass as any).getValidNumTicksForStringFormatter(10, ',.0f')
      ).toEqual(6);
    });
    it('returns the correct value if formatter makes decimals and numTicks is too big given domain max', () => {
      abstractClass.scale = {
        domain: domainSpy.and.returnValue([0, 5]),
      };
      expect(
        (abstractClass as any).getValidNumTicksForStringFormatter(100, ',.1f')
      ).toEqual(51);
    });
    it('returns the correct value if formatter makes percents and numTicks is too big given domain max', () => {
      abstractClass.scale = {
        domain: domainSpy.and.returnValue([0, 5]),
      };
      expect(
        (abstractClass as any).getValidNumTicksForStringFormatter(1000, '.0%')
      ).toEqual(501);
    });
  });
});

import { timeMonth } from 'd3';
import { QuantitativeAxisStub } from '../../testing/stubs/quantitative-axis.stub';
import { XyChartComponentStub } from '../../testing/stubs/xy-chart.component.stub';

describe('the QuantitativeAxis mixin', () => {
  let abstractClass: QuantitativeAxisStub;
  let chart: XyChartComponentStub;

  beforeEach(() => {
    chart = new XyChartComponentStub();
    abstractClass = new QuantitativeAxisStub(chart as any);
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
      tickValuesSpy = jasmine.createSpy('tickValues');
      tickFormatSpy = jasmine.createSpy('tickFormat');
      abstractClass.axis = {
        tickValues: tickValuesSpy,
        tickFormat: tickFormatSpy,
      };
      abstractClass.config = { tickValues: [1, 2, 3] };
      (abstractClass as any).setSpecifiedTickValues(tickFormat);
    });
    it('calls tickValues on axis with the correct values', () => {
      expect(tickValuesSpy).toHaveBeenCalledOnceWith([1, 2, 3]);
    });
    it('calls tickFormat on axis with the correct values', () => {
      expect(tickFormatSpy).toHaveBeenCalledTimes(1);
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
        'getValidNumTicksStringFormatter'
      ).and.returnValue(10);
      abstractClass.config = {
        numTicks: 1,
      } as any;
    });

    it('calls getNumTicks once', () => {
      tickFormat = ',.0f';
      (abstractClass as any).getValidNumTicks(tickFormat);
      expect((abstractClass as any).getNumTicks).toHaveBeenCalledTimes(1);
    });

    describe('if tickFormat is a string and return value from getNumTicks is a number', () => {
      beforeEach(() => {
        tickFormat = ',.0f';
      });
      it('calls getValidNumTicksStringFormatter once with the correct values', () => {
        (abstractClass as any).getValidNumTicks(tickFormat);
        expect(
          (abstractClass as any).getValidNumTicksStringFormatter
        ).toHaveBeenCalledOnceWith(8, tickFormat);
      });
      it('returns the result from getValidNumTicksStringFormatter', () => {
        expect((abstractClass as any).getValidNumTicks(tickFormat)).toEqual(10);
      });
    });

    describe('if tickFormat is not a string', () => {
      it('returns the result from getNumTicks', () => {
        tickFormat = () => 2;
        expect((abstractClass as any).getValidNumTicks(tickFormat)).toEqual(8);
      });
    });

    describe('if if result from initNumTicks is not a number', () => {
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

  describe('getValidNumTicksStringFormatter', () => {
    let intSpy: jasmine.Spy;
    let percentSpy: jasmine.Spy;
    beforeEach(() => {
      intSpy = spyOn(abstractClass as any, 'ticksAreIntegers').and.returnValue(
        true
      );
      percentSpy = spyOn(
        abstractClass as any,
        'ticksArePercentages'
      ).and.returnValue(false);
      spyOn(abstractClass as any, 'getValidIntegerNumTicks');
      spyOn(abstractClass as any, 'getValidPercentNumTicks');
    });
    it('calls ticksAreIntegers once with the correct value', () => {
      (abstractClass as any).getValidNumTicksStringFormatter(10, 'format');
      expect((abstractClass as any).ticksAreIntegers).toHaveBeenCalledOnceWith(
        'format'
      );
    });

    describe('if ticksAreIntegers returns true', () => {
      it('calls getValidIntegerNumTicks once with the correct values', () => {
        (abstractClass as any).getValidNumTicksStringFormatter(10, 'format');
        expect(
          (abstractClass as any).getValidIntegerNumTicks
        ).toHaveBeenCalledOnceWith(10);
      });
      it('returns the result from getValidIntegerNumTicks', () => {
        (abstractClass as any).getValidIntegerNumTicks.and.returnValue(20);
        expect(
          (abstractClass as any).getValidNumTicksStringFormatter(10, 'format')
        ).toEqual(20);
      });
    });

    describe('if ticksAreIntegers returns false', () => {
      beforeEach(() => {
        intSpy.and.returnValue(false);
      });
      it('calls ticksArePercentages once with the correct value', () => {
        (abstractClass as any).getValidNumTicksStringFormatter(10, 'format');
        expect(
          (abstractClass as any).ticksArePercentages
        ).toHaveBeenCalledOnceWith('format');
      });
      it('calls getValidPercentNumTicks once with the correct values if ticksArePercentages is true', () => {
        percentSpy.and.returnValue(true);
        (abstractClass as any).getValidNumTicksStringFormatter(10, 'format');
        expect(
          (abstractClass as any).getValidPercentNumTicks
        ).toHaveBeenCalledOnceWith(10, 'format');
      });
      it('returns the result from getValidPercentNumTicks if ticksArePercentages is true', () => {
        percentSpy.and.returnValue(true);
        (abstractClass as any).getValidPercentNumTicks.and.returnValue(20);
        expect(
          (abstractClass as any).getValidNumTicksStringFormatter(10, 'format')
        ).toEqual(20);
      });
      it('returns the original numTicks value if ticksArePercentages is false', () => {
        percentSpy.and.returnValue(false);
        expect(
          (abstractClass as any).getValidNumTicksStringFormatter(100, 'format')
        ).toEqual(100);
      });
    });
  });

  describe('getValidIntegerNumTicks', () => {
    let domainSpy: jasmine.Spy;
    beforeEach(() => {
      domainSpy = jasmine.createSpy('domain');
      abstractClass.scale = {
        domain: domainSpy.and.returnValue([0, 100]),
      };
    });
    describe('if numTicks is larger than scale domain', () => {
      it('returns the difference between the scale domain', () => {
        expect((abstractClass as any).getValidIntegerNumTicks(200)).toEqual(
          100
        );
      });
    });
    describe('if numTicks is less than 1', () => {
      it('returns 1', () => {
        expect((abstractClass as any).getValidIntegerNumTicks(0)).toEqual(1);
      });
    });
    describe('if domain max - min is less than one or equal to one', () => {
      it('returns 1 - case 1', () => {
        domainSpy.and.returnValue([0, 0.5]);
        expect((abstractClass as any).getValidIntegerNumTicks(0)).toEqual(1);
      });
      it('returns 1 - case 2', () => {
        domainSpy.and.returnValue([1, 2]);
        expect((abstractClass as any).getValidIntegerNumTicks(20)).toEqual(1);
      });
      it('returns 1 - case 3', () => {
        domainSpy.and.returnValue([0, 0.5]);
        expect((abstractClass as any).getValidIntegerNumTicks(20)).toEqual(1);
      });
    });
    describe('if numTicks is between 1 and scale domain and scale domain max min diff is larger than one', () => {
      it('returns the original value - case 1', () => {
        expect((abstractClass as any).getValidIntegerNumTicks(50)).toEqual(50);
      });
      it('returns the original value - case 2', () => {
        domainSpy.and.returnValue([0, 3]);
        expect((abstractClass as any).getValidIntegerNumTicks(2)).toEqual(2);
      });
    });
  });

  describe('getValidPercentNumTicks', () => {
    let domainSpy: jasmine.Spy;
    let decimalSpy: jasmine.Spy;
    beforeEach(() => {
      domainSpy = jasmine.createSpy('domain');
      abstractClass.scale = {
        domain: domainSpy.and.returnValue([1, 4]),
      };
      decimalSpy = spyOn(
        abstractClass as any,
        'getNumDecimalPlacesFromPercentFormat'
      ).and.returnValue(2);
    });
    it('calls getNumDecimalPlacesFromPercentFormat once with the correct value', () => {
      (abstractClass as any).getValidPercentNumTicks(10, 'format');
      expect(
        (abstractClass as any).getNumDecimalPlacesFromPercentFormat
      ).toHaveBeenCalledOnceWith('format');
    });
    it('returns the correct value if numTicks is larger than numPossibleTicks and not less than 1', () => {
      expect(
        (abstractClass as any).getValidPercentNumTicks(100, 'format')
      ).toEqual(100);
    });
    it('returns numPossibleTicks if numTicks is greater than numPossibleTicks and numPossibleTicks is greater than 1', () => {
      expect(
        (abstractClass as any).getValidPercentNumTicks(40000, 'format')
      ).toEqual(30000);
    });
    it('returns numPossibleTicks if numTicks is greater than numPossibleTicks and numPossibleTicks is greater than 1 - test 1', () => {
      domainSpy.and.returnValue([0, 0.5]);
      expect(
        (abstractClass as any).getValidPercentNumTicks(40000, 'format')
      ).toEqual(5000);
    });
    it('returns numPossibleTicks if numTicks is greater than numPossibleTicks and numPossibleTicks is greater than 1 - test 2', () => {
      domainSpy.and.returnValue([0, 0.5]);
      decimalSpy.and.returnValue(1);
      expect(
        (abstractClass as any).getValidPercentNumTicks(501, 'format')
      ).toEqual(500);
    });
    it('returns numPossibleTicks if numTicks is greater than numPossibleTicks and numPossibleTicks is greater than 1 - test 3', () => {
      domainSpy.and.returnValue([0, 0.5]);
      decimalSpy.and.returnValue(0);
      expect(
        (abstractClass as any).getValidPercentNumTicks(51, 'format')
      ).toEqual(50);
    });
    it('returns 1 if numTicks is 0', () => {
      expect(
        (abstractClass as any).getValidPercentNumTicks(0, 'format')
      ).toEqual(1);
    });
  });

  describe('getNumDecimalPlacesFromPercentFormat', () => {
    it('returns the number of decimal places in a percentage format - case 0', () => {
      expect(
        (abstractClass as any).getNumDecimalPlacesFromPercentFormat('.0%')
      ).toEqual(0);
    });
    it('returns the number of decimal places in a percentage format - case 1', () => {
      expect(
        (abstractClass as any).getNumDecimalPlacesFromPercentFormat('.1%')
      ).toEqual(1);
    });
    it('returns the number of decimal places in a percentage format - case 2', () => {
      expect(
        (abstractClass as any).getNumDecimalPlacesFromPercentFormat('.2%')
      ).toEqual(2);
    });
  });

  describe('ticksAreIntegers()', () => {
    it('returns true if tickFormat indicates ticks should be integer values', () => {
      expect((abstractClass as any).ticksAreIntegers('.0f')).toEqual(true);
    });

    it('returns false if tickFormat indicates ticks should not be integer values', () => {
      expect((abstractClass as any).ticksAreIntegers('.0%')).toEqual(false);
    });
  });
});

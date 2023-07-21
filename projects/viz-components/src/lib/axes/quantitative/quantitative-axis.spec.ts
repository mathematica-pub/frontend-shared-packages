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
      spyOn(abstractClass as any, 'getValidatedNumTicks').and.returnValue(10);
      ticksSpy = jasmine.createSpy('ticks');
      tickFormatSpy = jasmine.createSpy('tickFormat');
      abstractClass.axis = {
        ticks: ticksSpy,
        tickFormat: tickFormatSpy,
      };
      (abstractClass as any).setUnspecifiedTickValues(tickFormat);
    });
    it('calls getValidatedNumTicks once', () => {
      expect(
        (abstractClass as any).getValidatedNumTicks
      ).toHaveBeenCalledOnceWith(tickFormat);
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

  describe('getValidatedNumTicks', () => {
    let domainSpy: jasmine.Spy;
    let initSpy: jasmine.Spy;
    let integersSpy: jasmine.Spy;
    let percentageSpy: jasmine.Spy;
    const tickFormat = '%Y';
    beforeEach(() => {
      domainSpy = jasmine.createSpy('domain');
      abstractClass.scale = {
        domain: domainSpy.and.returnValue([1, 4]),
      };
      initSpy = spyOn(abstractClass, 'initNumTicks').and.returnValue(8);
      integersSpy = spyOn(abstractClass as any, 'ticksAreIntegers');
      percentageSpy = spyOn(abstractClass as any, 'ticksArePercentages');
      abstractClass.config = {
        numTicks: 1,
      } as any;
    });

    it('calls initNumTicks if config.numTicks is falsey', () => {
      abstractClass.config.numTicks = undefined;
      (abstractClass as any).getValidatedNumTicks(tickFormat);
      expect(initSpy).toHaveBeenCalledTimes(1);
    });

    describe('if tickFormat is a string', () => {
      beforeEach(() => {
        (abstractClass as any).getValidatedNumTicks(tickFormat);
      });
      it('calls ticksAreIntegers once with the correct value', () => {
        expect(
          (abstractClass as any).ticksAreIntegers
        ).toHaveBeenCalledOnceWith(tickFormat);
      });
      it('calls ticksArePercentages once with the correct value', () => {
        expect(
          (abstractClass as any).ticksArePercentages
        ).toHaveBeenCalledOnceWith(tickFormat);
      });
    });

    describe('if tickFormat is not a string', () => {
      let numTicks: number;
      beforeEach(() => {
        integersSpy.and.returnValue(true);
        percentageSpy.and.returnValue(true);
      });
      it('returns config.numTicks if config.numTicks is truthy', () => {
        abstractClass.config = {
          numTicks: 10,
        } as any;
        numTicks = (abstractClass as any).getValidatedNumTicks(
          (value: any) => 2
        );
        expect(numTicks).toEqual(10);
      });

      it('returns result from initNumTicks if config.numTicks is falsey', () => {
        abstractClass.config.numTicks = undefined;
        numTicks = (abstractClass as any).getValidatedNumTicks(
          (value: any) => 2
        );
        expect(numTicks).toEqual(8);
      });
    });

    describe('if ticksAreIntegers returns true', () => {
      beforeEach(() => {
        integersSpy.and.returnValue(true);
      });
      it('calls domain on scale once', () => {
        (abstractClass as any).getValidatedNumTicks(tickFormat);
        expect(domainSpy).toHaveBeenCalledTimes(1);
      });

      it('returns the difference between first and last values of domain if numTicks is greater than that difference', () => {
        abstractClass.config.numTicks = 10;
        domainSpy.and.returnValue([1, 4]);
        expect((abstractClass as any).getValidatedNumTicks(tickFormat)).toEqual(
          3
        );
      });

      it('returns config.numTicks if numTicks is less than that difference', () => {
        abstractClass.config.numTicks = 2;
        domainSpy.and.returnValue([1, 4]);
        expect((abstractClass as any).getValidatedNumTicks(tickFormat)).toEqual(
          2
        );
      });
    });

    describe('if ticksArePercentages returns true', () => {
      beforeEach(() => {
        integersSpy.and.returnValue(false);
        percentageSpy.and.returnValue(true);
      });

      describe('int: when numTicks is greater than number of possible ticks', () => {
        it('number of possible ticks is >= 1', () => {
          abstractClass.config.numTicks = 5;
          domainSpy.and.returnValue([0, 0.000157]);
          expect(
            (abstractClass as any).getValidatedNumTicks('.2%')
          ).toBeCloseTo(1.57);
          expect(domainSpy).toHaveBeenCalledTimes(1);
        });

        describe('number of possible ticks is < 1', () => {
          it('number of possible ticks is > 0', () => {
            abstractClass.config.numTicks = 5;
            domainSpy.and.returnValue([0, 0.000000004275]);
            expect((abstractClass as any).getValidatedNumTicks('.2%')).toEqual(
              1
            );
            expect(domainSpy).toHaveBeenCalledWith([0, 0.0001]);
          });

          it('number of possible ticks is equal to 0', () => {
            abstractClass.config.numTicks = 5;
            domainSpy.and.returnValue([0, 0]);
            expect((abstractClass as any).getValidatedNumTicks('.1%')).toEqual(
              1
            );
            expect(domainSpy).toHaveBeenCalledWith([0, 0.001]);
          });
        });
      });

      it('int: when numTicks is <= number of possible ticks', () => {
        abstractClass.config.numTicks = 5;
        domainSpy.and.returnValue([0, 0.08]);
        expect((abstractClass as any).getValidatedNumTicks('.0%')).toBe(5);
        expect(domainSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('if ticksAreIntegers and ticksArePercentages returns false', () => {
      beforeEach(() => {
        integersSpy.and.returnValue(false);
      });
      it('returns config.numTicks if config.numTicks is truthy', () => {
        expect((abstractClass as any).getValidatedNumTicks(tickFormat)).toEqual(
          1
        );
      });

      it('returns result from initNumTicks if config.numTicks is falsey', () => {
        abstractClass.config.numTicks = undefined;
        expect((abstractClass as any).getValidatedNumTicks(tickFormat)).toEqual(
          8
        );
      });
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

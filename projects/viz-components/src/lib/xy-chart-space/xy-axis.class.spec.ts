import { XYAxisElementStub } from '../testing/stubs/xy-axis.class.stub';

describe('the XYAxis abstract class', () => {
  let abstractClass: XYAxisElementStub;

  beforeEach(() => {
    abstractClass = new XYAxisElementStub();
  });

  describe('updateAxis()', () => {
    beforeEach(() => {
      spyOn(abstractClass, 'getAxisFunction').and.returnValue('func');
      spyOn(abstractClass, 'setAxis');
      spyOn(abstractClass, 'setTranslate');
      spyOn(abstractClass, 'drawAxis');
      spyOn(abstractClass, 'processAxisFeatures');
      abstractClass.updateAxis();
    });
    it('calls getAxisFunction once', () => {
      expect(abstractClass.getAxisFunction).toHaveBeenCalledTimes(1);
    });
    it('calls setAxis once with the correct value', () => {
      expect(abstractClass.setAxis).toHaveBeenCalledOnceWith('func');
    });

    it('calls setTranslate once', () => {
      expect(abstractClass.setTranslate).toHaveBeenCalledTimes(1);
    });

    it('calls drawAxis once', () => {
      expect(abstractClass.drawAxis).toHaveBeenCalledTimes(1);
    });

    it('calls processAxisFeatures once', () => {
      expect(abstractClass.processAxisFeatures).toHaveBeenCalledTimes(1);
    });
  });

  describe('getValidatedNumTicks', () => {
    let domainSpy: jasmine.Spy;
    let initSpy: jasmine.Spy;
    let integersSpy: jasmine.Spy;
    beforeEach(() => {
      domainSpy = jasmine.createSpy('domain');
      abstractClass.scale = {
        domain: domainSpy.and.returnValue([1, 4]),
      };
      initSpy = spyOn(abstractClass, 'initNumTicks');
      integersSpy = spyOn(abstractClass, 'ticksAreIntegers');
      abstractClass.config = {
        numTicks: 1,
      } as any;
    });

    it('calls ticksAreIntegers once if numTicks is of type number', () => {
      abstractClass.getValidatedNumTicks();
      expect(abstractClass.ticksAreIntegers).toHaveBeenCalled();
    });

    describe('if numTicks is falsey', () => {
      it('calls initNumTicks if config.numTicks is falsey', () => {
        abstractClass.config.numTicks = undefined;
        abstractClass.getValidatedNumTicks();
        expect(initSpy).toHaveBeenCalled();
      });
    });

    describe('if numTicks is truthy', () => {
      it('returns config.numTicks if numTicks is not of type number', () => {
        abstractClass.config.numTicks = '1d' as any;
        abstractClass.getValidatedNumTicks();
        expect(abstractClass.config.numTicks).toEqual('1d' as any);
      });

      describe('if numTicks is of type number ', () => {
        it('calls ticksAreIntegers once', () => {
          abstractClass.getValidatedNumTicks();
          expect(abstractClass.ticksAreIntegers).toHaveBeenCalled();
        });

        describe('if ticksAreIntegers returns true', () => {
          beforeEach(() => {
            integersSpy.and.returnValue(true);
          });
          it('calls domain on scale once', () => {
            abstractClass.getValidatedNumTicks();
            expect(domainSpy).toHaveBeenCalledTimes(1);
          });

          it('returns the difference between first and last values of domain if numTicks is greater than that difference', () => {
            abstractClass.config.numTicks = 10;
            domainSpy.and.returnValue([1, 4]);
            expect(abstractClass.getValidatedNumTicks()).toEqual(3);
          });

          it('returns config.numTicks if numTicks is less than that difference', () => {
            abstractClass.config.numTicks = 2;
            domainSpy.and.returnValue([1, 4]);
            expect(abstractClass.getValidatedNumTicks()).toEqual(2);
          });
        });
      });

      describe('if ticksAreIntegers returns false', () => {
        it('returns config.numTicks', () => {
          integersSpy.and.returnValue(false);
          expect(abstractClass.getValidatedNumTicks()).toEqual(1);
        });
      });
    });
  });

  describe('ticksAreIntegers()', () => {
    it('returns true if tickFormat indicates ticks should be integer values', () => {
      abstractClass.config = { tickFormat: ',.0f' } as any;
      expect(abstractClass.ticksAreIntegers()).toEqual(true);
    });

    it('returns true if tickFormat indicates ticks should not be integer values', () => {
      abstractClass.config = { tickFormat: '.0%' } as any;
      expect(abstractClass.ticksAreIntegers()).toEqual(false);
    });
  });
});

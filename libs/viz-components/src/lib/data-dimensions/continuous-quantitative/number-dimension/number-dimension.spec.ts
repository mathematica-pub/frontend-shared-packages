/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NumberDimension } from './number-dimension';

class ConcreteNumberDimension<Datum> extends NumberDimension<Datum> {
  setPropertiesFromData(data: Datum[], ...args: any): void {
    return;
  }
}

describe('NumberDimension', () => {
  let dimension: ConcreteNumberDimension<number>;
  beforeEach(() => {
    dimension = new ConcreteNumberDimension<number>();
  });

  describe('setDomain', () => {
    let calcSpy: jasmine.Spy;
    beforeEach(() => {
      calcSpy = spyOn(dimension as any, 'getCalculatedDomain').and.returnValue([
        10, 50,
      ]);
      spyOn(dimension as any, 'setDomainIncludesZero');
    });
    describe('user did not specify domain', () => {
      beforeEach(() => {
        dimension.values = [1, 2, 3, 4, 5];
      });
      describe('valuesOverride is defined', () => {
        beforeEach(() => {
          dimension.setDomain([20, 80]);
        });
        it('calls getCalculatedDomain once with correct value', () => {
          expect(
            (dimension as any).getCalculatedDomain
          ).toHaveBeenCalledOnceWith([20, 80]);
        });
        it('sets calculatedDomain to the return value of getCalculatedDomain', () => {
          expect((dimension as any).calculatedDomain).toEqual([10, 50]);
        });
        it('calls setDomainIncludesZero once', () => {
          expect(
            (dimension as any).setDomainIncludesZero
          ).toHaveBeenCalledTimes(1);
        });
      });
      describe('valuesOverride is not defined', () => {
        beforeEach(() => {
          dimension.setDomain();
        });
        it('calls getCalculatedDomain once with correct value', () => {
          expect(
            (dimension as any).getCalculatedDomain
          ).toHaveBeenCalledOnceWith([1, 5]);
        });
        it('sets calculatedDomain to the return value of getCalculatedDomain', () => {
          expect((dimension as any).calculatedDomain).toEqual([10, 50]);
        });
        it('calls setDomainIncludesZero once', () => {
          expect(
            (dimension as any).setDomainIncludesZero
          ).toHaveBeenCalledTimes(1);
        });
      });
    });
    describe('user specified domain', () => {
      describe('valuesOverride is defined', () => {
        beforeEach(() => {
          (dimension as any).domain = [5, 1];
          dimension.setDomain([20, 80]);
        });
        it('calls getCalculatedDomain once with correct value', () => {
          expect(
            (dimension as any).getCalculatedDomain
          ).toHaveBeenCalledOnceWith([5, 1]);
        });
        it('sets calculatedDomain to the return value of getCalculatedDomain', () => {
          expect((dimension as any).calculatedDomain).toEqual([10, 50]);
        });
        it('calls setDomainIncludesZero once', () => {
          expect(
            (dimension as any).setDomainIncludesZero
          ).toHaveBeenCalledTimes(1);
        });
      });
      describe('valuesOverride is not defined', () => {
        beforeEach(() => {
          (dimension as any).domain = [5, 1];
          dimension.setDomain();
        });
        it('calls getCalculatedDomain once with correct value', () => {
          expect(
            (dimension as any).getCalculatedDomain
          ).toHaveBeenCalledOnceWith([5, 1]);
        });
        it('sets calculatedDomain to the return value of getCalculatedDomain', () => {
          expect((dimension as any).calculatedDomain).toEqual([10, 50]);
        });
        it('calls setDomainIncludesZero once', () => {
          expect(
            (dimension as any).setDomainIncludesZero
          ).toHaveBeenCalledTimes(1);
        });
      });
    });
  });

  describe('getCalculatedDomain', () => {
    describe('includeZeroInDomain is true', () => {
      beforeEach(() => {
        (dimension as any).includeZeroInDomain = true;
      });
      it('returns a domain that includes zero, case: both values are positive', () => {
        const result = (dimension as any).getCalculatedDomain([1, 5]);
        expect(result).toEqual([0, 5]);
      });
      it('returns a domain that includes zero, case: both values are negative', () => {
        const result = (dimension as any).getCalculatedDomain([-5, -1]);
        expect(result).toEqual([-5, 0]);
      });
      it('returns a domain that includes zero, case: one value is negative and one is positive', () => {
        const result = (dimension as any).getCalculatedDomain([-5, 5]);
        expect(result).toEqual([-5, 5]);
      });
    });
    it('returns the input domain if includeZeroInDomain is false', () => {
      (dimension as any).includeZeroInDomain = false;
      const result = (dimension as any).getCalculatedDomain([20, 80]);
      expect(result).toEqual([20, 80]);
    });
  });

  describe('setDomainIncludesZero', () => {
    it('sets domainIncludesZero to true if includeZeroInDomain is true', () => {
      (dimension as any).includeZeroInDomain = true;
      dimension.setPropertiesFromData([1, 2, 3, 4, 5]);
      expect((dimension as any).domainIncludesZero).toEqual(true);
    });
    describe('includeZeroInDomain is false', () => {
      beforeEach(() => {
        (dimension as any).includeZeroInDomain = false;
      });
      it('sets domainIncludesZero to true if domain includes 0', () => {
        dimension.setPropertiesFromData([0, 1, 2, 3, 4, 5]);
        expect((dimension as any).domainIncludesZero).toEqual(true);
      });
      it('sets domainIncludesZero to false if domain does not include 0', () => {
        dimension.setPropertiesFromData([1, 2, 3, 4, 5]);
        expect((dimension as any).domainIncludesZero).toEqual(false);
      });
    });
  });
});

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vic } from '../../config/vic';
import { VicDimensionQuantitativeNumeric } from './quantitative-numeric';

describe('VicQuantitativeDimension', () => {
  let dimension: VicDimensionQuantitativeNumeric<number>;
  beforeEach(() => {
    dimension = Vic.dimensionQuantitativeNumeric({
      valueAccessor: (d) => d,
    });
  });
  describe('setPropertiesFromData', () => {
    beforeEach(() => {
      spyOn(dimension as any, 'setValues');
      spyOn(dimension as any, 'setDomain');
    });
    it('calls setValues once', () => {
      dimension.setPropertiesFromData([1, 2, 3, 4, 5]);
      expect((dimension as any).setValues).toHaveBeenCalledOnceWith([
        1, 2, 3, 4, 5,
      ]);
    });
    it('calls setDomain once', () => {
      dimension.setPropertiesFromData([1, 2, 3, 4, 5]);
      expect((dimension as any).setDomain).toHaveBeenCalledTimes(1);
    });
  });

  describe('setDomain', () => {
    let calcSpy: jasmine.Spy;
    beforeEach(() => {
      calcSpy = spyOn(dimension as any, 'getCalculatedDomain').and.returnValue([
        10, 50,
      ]);
      spyOn(dimension as any, 'setDomainIncludesZero');
    });
    it('calls getCalculatedDomain once with correct value, user did not specify domain', () => {
      dimension.setPropertiesFromData([1, 2, 3, 4, 5]);
      expect((dimension as any).getCalculatedDomain).toHaveBeenCalledOnceWith([
        1, 5,
      ]);
    });
    it('calls getCalculatedDomain once with correct value, user specified domain', () => {
      (dimension as any).domain = [5, 1];
      dimension.setPropertiesFromData([1, 2, 3, 4, 5]);
      expect((dimension as any).getCalculatedDomain).toHaveBeenCalledOnceWith([
        5, 1,
      ]);
    });
    it('calls setDomainIncludesZero once', () => {
      dimension.setPropertiesFromData([1, 2, 3, 4, 5]);
      expect((dimension as any).setDomainIncludesZero).toHaveBeenCalledTimes(1);
    });
    it('sets calculatedDomain to the return value of getCalculatedDomain', () => {
      dimension.setPropertiesFromData([1, 2, 3, 4, 5]);
      expect((dimension as any).calculatedDomain).toEqual([10, 50]);
    });
    it('calls getCalculatedDomain once with provided valuesOverride if that is provided', () => {
      dimension.setPropertiesFromData([1, 2, 3, 4, 5]);
      calcSpy.calls.reset();
      dimension.setDomain([20, 80]);
      expect((dimension as any).getCalculatedDomain).toHaveBeenCalledOnceWith([
        20, 80,
      ]);
    });
  });

  describe('getCalculatedDomain', () => {
    it('returns a domain that includes zero if includeZeroInDomain is true - both values are positive', () => {
      (dimension as any).includeZeroInDomain = true;
      const result = (dimension as any).getCalculatedDomain([1, 5]);
      expect(result).toEqual([0, 5]);
    });
    it('returns a domain that includes zero if includeZeroInDomain is true - both values are negative', () => {
      (dimension as any).includeZeroInDomain = true;
      const result = (dimension as any).getCalculatedDomain([-5, -1]);
      expect(result).toEqual([-5, 0]);
    });
    it('returns a domain that includes zero if includeZeroInDomain is true - one value is negative and one is positive', () => {
      (dimension as any).includeZeroInDomain = true;
      const result = (dimension as any).getCalculatedDomain([-5, 5]);
      expect(result).toEqual([-5, 5]);
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

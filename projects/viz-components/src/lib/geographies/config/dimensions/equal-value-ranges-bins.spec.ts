/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vic } from '../../../config/vic';
import { VicEqualValuesAttributeDataDimension } from './equal-value-ranges-bins';

describe('VicEqualValuesAttributeDataDimension', () => {
  let dimension: VicEqualValuesAttributeDataDimension<any>;
  beforeEach(() => {
    dimension = Vic.geographiesDataDimensionEqualValueRanges({
      numBins: 3,
      formatSpecifier: '.1f',
      range: ['red', 'blue', 'yellow', 'green'],
      domain: [0, 20],
      valueAccessor: (d) => d,
    });
  });

  describe('setPropertiesFromData', () => {
    beforeEach(() => {
      spyOn(dimension as any, 'setDomain');
      spyOn(dimension as any, 'setValidatedDomainAndNumBins');
      spyOn(dimension as any, 'setRange');
    });
    it('calls setDomain once', () => {
      dimension.setPropertiesFromData([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect((dimension as any).setDomain).toHaveBeenCalledOnceWith([
        1, 2, 3, 4, 5, 6, 7, 8, 9,
      ]);
    });
    it('calls setValidatedDomainAndNumBins once', () => {
      dimension.setPropertiesFromData([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(
        (dimension as any).setValidatedDomainAndNumBins
      ).toHaveBeenCalledTimes(1);
    });
    it('calls setRange once', () => {
      dimension.setPropertiesFromData([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect((dimension as any).setRange).toHaveBeenCalledTimes(1);
    });
  });

  describe('integration: setDomain/setValidatedDomainAndNumBins', () => {
    it('sets the domain to the users value if it exists', () => {
      (dimension as any).setDomain([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      (dimension as any).setValidatedDomainAndNumBins();
      expect((dimension as any).calculatedDomain).toEqual([0, 20]);
    });
    it('sets the domain to values if there is no user provided domain', () => {
      dimension = Vic.geographiesDataDimensionEqualValueRanges({
        numBins: 3,
        formatSpecifier: '.1f',
        range: ['red', 'blue', 'yellow', 'green'],
        valueAccessor: (d) => d,
      });
      (dimension as any).setDomain([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect((dimension as any).calculatedDomain).toEqual([1, 9]);
    });
  });

  describe('getValidatedNumBinsAndDomainForIntegerValues', () => {
    it('returns a numBins that reflects possible values in domain and a domain of [min, max + 1] when numBins is greater than the length of the data', () => {
      expect(
        (dimension as any).getValidatedNumBinsAndDomainForIntegerValues(
          5,
          [-1, 1]
        )
      ).toEqual({ numBins: 3, domain: [-1, 2] });
    });
    it('returns the correct values when numBins is less than the length of the data', () => {
      expect(
        (dimension as any).getValidatedNumBinsAndDomainForIntegerValues(
          2,
          [-1, 33]
        )
      ).toEqual({ numBins: 2, domain: [-1, 33] });
    });
  });

  describe('integration: getScale', () => {
    let scale: any;
    beforeEach(() => {
      dimension = Vic.geographiesDataDimensionEqualValueRanges({
        numBins: 4,
        formatSpecifier: '.1f',
        range: ['red', 'blue', 'yellow', 'green'],
        valueAccessor: (d) => d,
        nullColor: 'black',
      });
      dimension.setPropertiesFromData([0, 2, 4, 6, 8]);
      scale = dimension.getScale();
    });
    it('correctly sets the domain', () => {
      expect(scale.domain()).toEqual([0, 8]);
    });
    it('correctly sets the range', () => {
      expect(scale.range()).toEqual(['red', 'blue', 'yellow', 'green']);
    });
    it('correctly scales a value in the domain', () => {
      expect(scale(2)).toEqual('blue');
    });
    it('correctly scales a value out of the domain', () => {
      expect(scale(null)).toEqual('black');
    });
  });
});

import { VicEqualValuesAttributeDataDimension } from './equal-value-ranges-bins';

describe('VicEqualValuesAttributeDataDimension', () => {
  let dimension: VicEqualValuesAttributeDataDimension<any>;
  beforeEach(() => {
    dimension = new VicEqualValuesAttributeDataDimension();
  });
  describe('integration: setDomainAndBins', () => {
    beforeEach(() => {
      dimension.numBins = 3;
      dimension.valueFormat = '.1f';
      dimension.range = ['red', 'blue', 'yellow', 'green'];
    });
    it('sets the domain to the users value if it exists', () => {
      dimension.domain = [0, 20];
      (dimension as any).setDomainAndBins([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(dimension.domain).toEqual([0, 20]);
    });
    it('sets the domain is values if there is no user provided domain', () => {
      (dimension as any).setDomainAndBins([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(dimension.domain).toEqual([1, 9]);
    });
  });
  describe('getValidatedNumBinsAndIntegervalues', () => {
    beforeEach(() => {
      dimension.valueFormat = '.0f';
    });
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
});

import {
  VicEqualValuesAttributeDataDimension,
  vicEqualValuesAttributeDataDimension,
} from './equal-value-ranges-bins';

describe('VicEqualValuesAttributeDataDimension', () => {
  let dimension: VicEqualValuesAttributeDataDimension<any>;
  beforeEach(() => {
    dimension = vicEqualValuesAttributeDataDimension({
      numBins: 3,
      valueFormat: '.1f',
      range: ['red', 'blue', 'yellow', 'green'],
      domain: [0, 20],
      valueAccessor: (d) => d,
    });
  });

  describe('setPropertiesFromData', () => {
    beforeEach(() => {
      spyOn(dimension as any, 'setDomainAndBins');
      spyOn(dimension as any, 'setRange');
    });
    it('calls setDomainAndBins once', () => {
      dimension.setPropertiesFromData([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect((dimension as any).setDomainAndBins).toHaveBeenCalledOnceWith([
        1, 2, 3, 4, 5, 6, 7, 8, 9,
      ]);
    });
    it('calls setRange once', () => {
      dimension.setPropertiesFromData([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect((dimension as any).setRange).toHaveBeenCalledTimes(1);
    });
  });

  describe('integration: setDomainAndBins', () => {
    it('sets the domain to the users value if it exists', () => {
      (dimension as any).setDomainAndBins([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(dimension.domain).toEqual([0, 20]);
    });
    it('sets the domain is values if there is no user provided domain', () => {
      dimension = vicEqualValuesAttributeDataDimension({
        numBins: 3,
        valueFormat: '.1f',
        range: ['red', 'blue', 'yellow', 'green'],
        valueAccessor: (d) => d,
      });
      (dimension as any).setDomainAndBins([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(dimension.domain).toEqual([1, 9]);
    });
  });

  describe('getValidatedNumBinsAndIntegervalues', () => {
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
      dimension = vicEqualValuesAttributeDataDimension({
        numBins: 4,
        valueFormat: '.1f',
        range: ['red', 'blue', 'yellow', 'green'],
        valueAccessor: (d) => d,
      });
      dimension.setPropertiesFromData([0, 2, 4, 6, 8]);
      scale = dimension.getScale('black');
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

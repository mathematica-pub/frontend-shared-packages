import {
  VicCategoricalAttributeDataDimension,
  vicCategoricalAttributeDataDimension,
} from './categorical-bins';

describe('VicCategoricalAttributeDataDimension', () => {
  let dimension: VicCategoricalAttributeDataDimension<string>;
  beforeEach(() => {
    dimension = vicCategoricalAttributeDataDimension({
      valueAccessor: (d) => d,
    });
  });
  describe('integration: setPropertiesFromData/setDomainAndBins/setRange', () => {
    it('sets the domain to the correct value, user did not specify domain', () => {
      dimension.setPropertiesFromData(['a', 'b', 'c', 'a', 'b']);
      expect(dimension.domain).toEqual(['a', 'b', 'c']);
    });
    it('sets the domain to the correct value, user specified domain', () => {
      dimension.domain = ['c', 'd', 'b', 'a', 'd'];
      dimension.setPropertiesFromData(['a', 'b', 'c', 'a', 'b']);
      expect(dimension.domain).toEqual(['c', 'd', 'b', 'a']);
    });
    it('sets the range to the correct values/length', () => {
      dimension.range = ['red', 'blue', 'green', 'yellow', 'purple'];
      dimension.setPropertiesFromData(['a', 'b', 'c']);
      expect(dimension.range).toEqual(['red', 'blue', 'green']);
    });
  });
});

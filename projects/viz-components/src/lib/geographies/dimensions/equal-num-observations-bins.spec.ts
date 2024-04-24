import { VicEqualNumObservationsAttributeDataDimension } from './equal-num-observations-bins';

describe('VicEqualNumObservationsBins', () => {
  let dimension: VicEqualNumObservationsAttributeDataDimension<any>;
  beforeEach(() => {
    dimension = new VicEqualNumObservationsAttributeDataDimension();
  });
  describe('integration: setPropertiesFromData', () => {
    it('sets the domain to the correct value -- and overwrites any domain a user may have provided', () => {
      dimension.numBins = 3;
      dimension.range = ['red', 'blue', 'yellow', 'green'];
      dimension.domain = [0, 20, 50];
      dimension.setPropertiesFromData([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(dimension.domain).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
  });
});

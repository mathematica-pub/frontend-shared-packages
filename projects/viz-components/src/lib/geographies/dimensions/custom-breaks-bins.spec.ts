import { VicCustomBreaksAttributeDataDimension } from './custom-breaks-bins';

describe('VicCustomBreaksAttributeDataDimension', () => {
  let dimension: VicCustomBreaksAttributeDataDimension<any>;
  beforeEach(() => {
    dimension = new VicCustomBreaksAttributeDataDimension();
  });
  describe('setDomainAndBins', () => {
    beforeEach(() => {
      dimension.breakValues = [0, 2, 5, 10, 50];
      (dimension as any).setDomainAndBins();
    });
    it('sets the domain to the correct value', () => {
      expect(dimension.domain).toEqual([2, 5, 10, 50]);
    });
    it('sets the numBins to the correct value', () => {
      expect(dimension.numBins).toEqual(4);
    });
  });
});

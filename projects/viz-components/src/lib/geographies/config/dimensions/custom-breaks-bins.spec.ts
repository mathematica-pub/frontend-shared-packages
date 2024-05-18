import {
  VicCustomBreaksAttributeDataDimension,
  vicCustomBreaksAttributeDataDimension,
} from './custom-breaks-bins';

describe('VicCustomBreaksAttributeDataDimension', () => {
  let dimension: VicCustomBreaksAttributeDataDimension<any>;
  beforeEach(() => {
    dimension = vicCustomBreaksAttributeDataDimension({
      breakValues: [0, 2, 5, 10, 50],
      range: ['red', 'blue', 'yellow', 'green'],
    });
  });

  describe('setPropertiesFromData', () => {
    beforeEach(() => {
      spyOn(dimension as any, 'setDomainAndBins');
      spyOn(dimension as any, 'setRange');
    });
    it('calls setDomainAndBins once', () => {
      dimension.setPropertiesFromData();
      expect((dimension as any).setDomainAndBins).toHaveBeenCalledTimes(1);
    });
    it('calls setRange once', () => {
      dimension.setPropertiesFromData();
      expect((dimension as any).setRange).toHaveBeenCalledTimes(1);
    });
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

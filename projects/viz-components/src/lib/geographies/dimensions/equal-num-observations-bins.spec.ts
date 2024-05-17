/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  VicEqualNumObservationsAttributeDataDimension,
  vicEqualNumObservationsAttributeDataDimension,
} from './equal-num-observations-bins';

describe('VicEqualNumObservationsBins', () => {
  let dimension: VicEqualNumObservationsAttributeDataDimension<any, string>;
  beforeEach(() => {
    dimension = vicEqualNumObservationsAttributeDataDimension({
      numBins: 4,
      range: ['red', 'blue', 'yellow', 'green'],
      valueAccessor: (d) => d,
    });
  });
  describe('setPropertiesFromData', () => {
    beforeEach(() => {
      spyOn(dimension as any, 'setDomainAndBins');
      spyOn(dimension as any, 'setRange');
    });
    it('calls setDomainAndBins once', () => {
      dimension.setPropertiesFromData([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      expect((dimension as any).setDomainAndBins).toHaveBeenCalledOnceWith([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
      ]);
    });
    it('calls setRange once', () => {
      dimension.setPropertiesFromData([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      expect((dimension as any).setRange).toHaveBeenCalledTimes(1);
    });
  });

  describe('integration: setDomainAndBins', () => {
    it('sets the domain to the values', () => {
      dimension.setPropertiesFromData([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      expect(dimension.domain).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });
  });

  describe('integration: getScale', () => {
    let scale: any;
    beforeEach(() => {
      dimension.setPropertiesFromData([0, 2, 4, 6]);
      scale = dimension.getScale('black');
    });
    it('correctly sets the domain', () => {
      expect(scale.domain()).toEqual([0, 2, 4, 6]);
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

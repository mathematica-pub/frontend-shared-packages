/* eslint-disable @typescript-eslint/no-explicit-any */
import { EqualFrequenciesAttributeDataDimension } from './equal-frequencies-bins';
import { EqualFrequenciesAttributeDataDimensionBuilder } from './equal-frequencies-bins-builder';

describe('VicEqualNumObservationsBins', () => {
  let dimension: EqualFrequenciesAttributeDataDimension<any, string>;
  beforeEach(() => {
    dimension = new EqualFrequenciesAttributeDataDimensionBuilder<any, string>()
      .numBins(4)
      .range(['red', 'blue', 'yellow', 'green'])
      .valueAccessor((d) => d)
      .nullColor('black')
      ._build();
  });
  describe('setPropertiesFromData', () => {
    beforeEach(() => {
      spyOn(dimension as any, 'setDomain');
      spyOn(dimension as any, 'setNumBins');
      spyOn(dimension as any, 'setRange');
    });
    it('calls setDomain once', () => {
      dimension.setPropertiesFromData([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      expect((dimension as any).setDomain).toHaveBeenCalledOnceWith([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
      ]);
    });
    it('calls setNumBins once', () => {
      dimension.setPropertiesFromData([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      expect((dimension as any).setNumBins).toHaveBeenCalledTimes(1);
    });
    it('calls setRange once', () => {
      dimension.setPropertiesFromData([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      expect((dimension as any).setRange).toHaveBeenCalledTimes(1);
    });
  });

  describe('integration: setDomain', () => {
    it('sets the domain to the values', () => {
      dimension.setPropertiesFromData([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      expect((dimension as any).calculatedDomain).toEqual([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
      ]);
    });
  });

  describe('integration: setNumBins', () => {
    it('sets the calculatedNumBins correctly', () => {
      dimension.setPropertiesFromData([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      expect((dimension as any).calculatedNumBins).toEqual(4);
    });
  });

  describe('integration: getScale', () => {
    let scale: any;
    beforeEach(() => {
      dimension.setPropertiesFromData([0, 2, 4, 6]);
      scale = dimension.getScale();
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

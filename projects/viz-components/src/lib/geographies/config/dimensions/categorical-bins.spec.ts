/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vic } from '../../../config/vic';
import { VicCategoricalAttributeDataDimension } from './categorical-bins';

describe('VicCategoricalAttributeDataDimension', () => {
  let dimension: VicCategoricalAttributeDataDimension<string>;
  beforeEach(() => {
    dimension = Vic.geographiesDataDimensionCategorical({
      valueAccessor: (d) => d,
    });
  });
  describe('setPropertiesFromData', () => {
    beforeEach(() => {
      spyOn(dimension as any, 'setDomain');
      spyOn(dimension as any, 'setRange');
    });
    it('calls setDomain once', () => {
      dimension.setPropertiesFromData(['a', 'b', 'c']);
      expect((dimension as any).setDomain).toHaveBeenCalledTimes(1);
    });
    it('calls setRange once', () => {
      dimension.setPropertiesFromData(['a', 'b', 'c']);
      expect((dimension as any).setRange).toHaveBeenCalledTimes(1);
    });
  });

  describe('setDomain', () => {
    it('sets the domain to uniqued values', () => {
      dimension.setPropertiesFromData(['a', 'b', 'c', 'b']);
      expect((dimension as any).calculatedDomain).toEqual(['a', 'b', 'c']);
    });
    it('sets the domain to uniqued user values if specified', () => {
      (dimension as any).domain = ['c', 'd', 'b', 'a', 'd'];
      dimension.setPropertiesFromData(['a', 'b', 'c', 'a', 'b']);
      expect((dimension as any).calculatedDomain).toEqual(['c', 'd', 'b', 'a']);
    });
  });

  describe('setRange', () => {
    it('sets the range to the correct values/length', () => {
      dimension.range = ['red', 'blue', 'green', 'yellow', 'purple'];
      dimension.setPropertiesFromData(['a', 'b', 'c']);
      expect(dimension.range).toEqual(['red', 'blue', 'green']);
    });
  });
});

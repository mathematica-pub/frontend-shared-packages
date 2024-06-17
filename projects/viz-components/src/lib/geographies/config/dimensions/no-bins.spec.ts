/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vic } from '../../../config/vic';
import { VicNoBinsAttributeDataDimension } from './no-bins';

describe('VicNoBinsAttributeDataDimension', () => {
  let dimension: VicNoBinsAttributeDataDimension<any>;
  beforeEach(() => {
    dimension = Vic.geographiesDataDimensionNoBins({
      valueAccessor: (d) => d,
    });
  });

  describe('setPropertiesFromData', () => {
    beforeEach(() => {
      spyOn(dimension as any, 'setDomain');
    });
    it('calls setDomain once', () => {
      dimension.setPropertiesFromData([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect((dimension as any).setDomain).toHaveBeenCalledOnceWith([
        1, 2, 3, 4, 5, 6, 7, 8, 9,
      ]);
    });
  });

  describe('setDomain', () => {
    it('sets the domain to the users value if it exists', () => {
      dimension = Vic.geographiesDataDimensionNoBins({
        domain: [0, 5],
        valueAccessor: (d) => d,
      });
      (dimension as any).setDomain([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect((dimension as any).domain).toEqual([0, 5]);
    });
    it('sets the domain to values if there is no user provided domain', () => {
      dimension = Vic.geographiesDataDimensionNoBins({
        valueAccessor: (d) => d,
      });
      (dimension as any).setDomain([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect((dimension as any).domain).toEqual([1, 9]);
    });
  });
});

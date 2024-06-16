/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vic } from '../../config/vic';
import { VicDimensionDate } from './date-dimension';

describe('VicDateDimension', () => {
  let dimension: VicDimensionDate<Date>;
  beforeEach(() => {
    dimension = Vic.dimensionDate({
      valueAccessor: (d) => d,
    });
  });
  describe('setPropertiesFromData', () => {
    beforeEach(() => {
      spyOn(dimension as any, 'setValues');
      spyOn(dimension as any, 'setDomain');
    });
    it('calls setValues once', () => {
      dimension.setPropertiesFromData([new Date(), new Date(), new Date()]);
      expect((dimension as any).setValues).toHaveBeenCalledOnceWith([
        new Date(),
        new Date(),
        new Date(),
      ]);
    });
    it('calls setDomain once', () => {
      dimension.setPropertiesFromData([new Date(), new Date(), new Date()]);
      expect((dimension as any).setDomain).toHaveBeenCalledTimes(1);
    });
  });

  describe('integration: setDomain', () => {
    it('sets the domain to the correct value, user did not specify domain', () => {
      dimension.setPropertiesFromData([
        new Date('2020-01-01'),
        new Date('2020-01-02'),
        new Date('2020-01-03'),
      ]);
      expect((dimension as any).calculatedDomain).toEqual([
        new Date('2020-01-01'),
        new Date('2020-01-03'),
      ]);
    });
    it('sets the domain to the correct value, user specified domain', () => {
      (dimension as any).domain = [
        new Date('2020-01-03'),
        new Date('2020-01-01'),
      ];
      dimension.setPropertiesFromData([
        new Date('2020-01-01'),
        new Date('2020-01-03'),
      ]);
      expect((dimension as any).calculatedDomain).toEqual([
        new Date('2020-01-03'),
        new Date('2020-01-01'),
      ]);
    });
  });
});

/* eslint-disable @typescript-eslint/no-explicit-any */
import { VicDimensionQuantitativeDate } from './quantitative-date';
import { QuantitativeDateDimensionBuilder } from './quantitative-date-builder';

describe('VicDateDimension', () => {
  let dimension: VicDimensionQuantitativeDate<Date>;
  beforeEach(() => {
    dimension = new QuantitativeDateDimensionBuilder<Date>()
      .valueAccessor((d) => d)
      .build();
  });
  describe('setPropertiesFromData', () => {
    beforeEach(() => {
      spyOn(dimension as any, 'setValues');
      spyOn(dimension as any, 'setDomain');
    });
    it('calls setValues once', () => {
      dimension.setPropertiesFromData([
        new Date(2000, 2),
        new Date(2001, 2),
        new Date(2002, 2),
      ]);
      expect((dimension as any).setValues).toHaveBeenCalledOnceWith([
        new Date(2000, 2),
        new Date(2001, 2),
        new Date(2002, 2),
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

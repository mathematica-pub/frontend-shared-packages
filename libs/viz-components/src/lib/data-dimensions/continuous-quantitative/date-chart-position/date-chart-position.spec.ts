/* eslint-disable @typescript-eslint/no-explicit-any */
import { DateChartPositionDimension } from './date-chart-position';
import { DateChartPositionDimensionBuilder } from './date-chart-position-builder';

describe('DateChartPositionDimension', () => {
  let dimension: DateChartPositionDimension<Date>;
  beforeEach(() => {
    dimension = new DateChartPositionDimensionBuilder<Date>()
      .valueAccessor((d) => d)
      ._build('Test');
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

  describe('setDomain()', () => {
    describe('when user specifies a domain', () => {
      it('sets the domain to an array of unique values in the user-provided domain', () => {
        (dimension as any).domain = [
          new Date('2020-01-03'),
          new Date('2020-01-01'),
          new Date('2020-01-01'),
        ];
        dimension.setPropertiesFromData([
          new Date('2020-02-01'),
          new Date('2020-02-02'),
        ]);
        expect((dimension as any).calculatedDomain).toEqual([
          new Date('2020-01-03'),
          new Date('2020-01-01'),
        ]);
      });
    });
    describe('when user does not specify a domain', () => {
      it('sets the domain to the unique values from the data', () => {
        dimension.setPropertiesFromData([
          new Date('2020-01-01'),
          new Date('2020-01-01'),
          new Date('2020-01-03'),
        ]);
        expect((dimension as any).calculatedDomain).toEqual([
          new Date('2020-01-01'),
          new Date('2020-01-03'),
        ]);
      });
    });
  });
});

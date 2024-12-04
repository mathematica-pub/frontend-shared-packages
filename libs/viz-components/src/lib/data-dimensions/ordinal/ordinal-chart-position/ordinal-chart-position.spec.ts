/* eslint-disable @typescript-eslint/no-explicit-any */
import { OrdinalChartPositionDimension } from './ordinal-chart-position';
import { OrdinalChartPositionDimensionBuilder } from './ordinal-chart-position-builder';

const data = [
  { value: 1, category: 'a' },
  { value: 2, category: 'b' },
  { value: 3, category: 'c' },
  { value: 4, category: 'a' },
  { value: 5, category: 'b' },
];

describe('OrdinalChartPositionDimension', () => {
  let dimension: OrdinalChartPositionDimension<
    { value: number; category: string },
    string
  >;
  beforeEach(() => {
    dimension = new OrdinalChartPositionDimensionBuilder<
      { value: number; category: string },
      string
    >()
      .valueAccessor((d) => d.category)
      ._build('band', 'Test');
  });
  describe('setPropertiesFromData', () => {
    beforeEach(() => {
      spyOn(dimension as any, 'setValues');
      spyOn(dimension as any, 'setDomain');
    });
    it('calls setValues once', () => {
      dimension.setPropertiesFromData(data, false);
      expect((dimension as any).setValues).toHaveBeenCalledOnceWith(data);
    });
    it('calls initDomain once', () => {
      dimension.setPropertiesFromData(data, false);
      expect((dimension as any).setDomain).toHaveBeenCalledOnceWith(false);
    });
  });

  describe('setDomain()', () => {
    describe('when user specifies a domain', () => {
      beforeEach(() => {
        (dimension as any).domain = ['e', 'f', 'g', 'e'];
      });
      it('sets the domain to the unique values in user specified domain in the provided order, and ignores values from data', () => {
        dimension.setPropertiesFromData(data, false);
        expect((dimension as any)._calculatedDomain).toEqual(['e', 'f', 'g']);
      });
      describe('when reverseDomain is true', () => {
        it('sets the domain to the unique values in user specified domain in reverse order, and ignores values from data', () => {
          dimension.setPropertiesFromData(data, true);
          expect((dimension as any)._calculatedDomain).toEqual(['g', 'f', 'e']);
        });
      });
    });
    describe('when user does not specify a domain', () => {
      it('sets the domain to the unique values in the data in the provided order', () => {
        dimension.setPropertiesFromData(data, false);
        expect((dimension as any)._calculatedDomain).toEqual(['a', 'b', 'c']);
      });
      describe('when reverseDomain is true', () => {
        it('sets the domain to the unique values in the data in reverse order', () => {
          dimension.setPropertiesFromData(data, true);
          expect((dimension as any)._calculatedDomain).toEqual(['c', 'b', 'a']);
        });
      });
    });
  });

  describe('domainIncludes()', () => {
    it('correctly sets internSetDomain and domainIncludes returns correct value', () => {
      (dimension as any).domain = ['c', 'd', 'b', 'a', 'd'];
      dimension.setPropertiesFromData(data, false);
      expect(dimension.domainIncludes('a')).toEqual(true);
    });
    it('correctly sets internSetDomain and domainIncludes returns correct value - scenario 2', () => {
      (dimension as any).domain = ['c', 'd', 'b', 'a', 'd'];
      dimension.setPropertiesFromData(data, false);
      expect(dimension.domainIncludes('z')).toEqual(false);
    });
  });
});

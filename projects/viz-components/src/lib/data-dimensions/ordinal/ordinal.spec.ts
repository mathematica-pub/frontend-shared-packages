/* eslint-disable @typescript-eslint/no-explicit-any */
import { VicDimensionOrdinal } from './ordinal';
import { OrdinalDimensionBuilder } from './ordinal-builder';

const data = [
  { value: 1, category: 'a' },
  { value: 2, category: 'b' },
  { value: 3, category: 'c' },
  { value: 4, category: 'a' },
  { value: 5, category: 'b' },
];

describe('VicDimensionOrdinal', () => {
  let dimension: VicDimensionOrdinal<
    { value: number; category: string },
    string
  >;
  beforeEach(() => {
    dimension = new OrdinalDimensionBuilder<
      { value: number; category: string },
      string
    >()
      .valueAccessor((d) => d.category)
      .build();
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

  describe('setDomain', () => {
    it('sets the domain to the correct value, user did not specify domain and reverse domain is false', () => {
      dimension.setPropertiesFromData(data, false);
      expect((dimension as any)._calculatedDomain).toEqual(['a', 'b', 'c']);
    });
    it('sets the domain to the correct value, user did not specify domain and reverse domain is true', () => {
      dimension.setPropertiesFromData(data, true);
      expect((dimension as any)._calculatedDomain).toEqual(['c', 'b', 'a']);
    });
    it('sets the domain to the correct value, user specified domain', () => {
      (dimension as any).domain = ['c', 'd', 'b', 'a', 'd'];
      dimension.setPropertiesFromData(data, false);
      expect((dimension as any)._calculatedDomain).toEqual([
        'c',
        'd',
        'b',
        'a',
      ]);
    });
    it('sets the domain to the correct value, user specified domain and reverseDomain is true', () => {
      (dimension as any).domain = ['c', 'd', 'b', 'a', 'd'];
      dimension.setPropertiesFromData(data, true);
      expect((dimension as any)._calculatedDomain).toEqual([
        'a',
        'b',
        'd',
        'c',
      ]);
    });
  });

  describe('domainIncludes', () => {
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

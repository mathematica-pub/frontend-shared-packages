/* eslint-disable @typescript-eslint/no-explicit-any */

import { OrdinalVisualValueDimension } from './ordinal-visual-value';
import { OrdinalVisualValueDimensionBuilder } from './ordinal-visual-value-builder';

describe('OrdinalVisualValueDimension', () => {
  let dimension: OrdinalVisualValueDimension<string, string, string>;
  beforeEach(() => {
    dimension = new OrdinalVisualValueDimensionBuilder<string, string, string>()
      .valueAccessor((d) => d)
      ._build('Test');
  });
  describe('setPropertiesFromData', () => {
    beforeEach(() => {
      spyOn(dimension as any, 'setValues');
      spyOn(dimension as any, 'setDomain');
      spyOn(dimension as any, 'setScale');
    });
    it('calls setValues once', () => {
      dimension.setPropertiesFromData(['a', 'b', 'c', 'a', 'b']);
      expect((dimension as any).setValues).toHaveBeenCalledOnceWith([
        'a',
        'b',
        'c',
        'a',
        'b',
      ]);
    });
    it('calls initDomain once', () => {
      dimension.setPropertiesFromData(['a', 'b', 'c', 'a', 'b']);
      expect((dimension as any).setDomain).toHaveBeenCalledTimes(1);
    });
    it('calls initScale once', () => {
      dimension.setPropertiesFromData(['a', 'b', 'c', 'a', 'b']);
      expect((dimension as any).setScale).toHaveBeenCalledTimes(1);
    });
  });

  describe('integration: setDomain', () => {
    it('sets the domain to the correct value, user did not specify domain', () => {
      dimension.setPropertiesFromData(['a', 'b', 'c', 'a', 'b']);
      expect((dimension as any).calculatedDomain).toEqual(['a', 'b', 'c']);
    });
    it('sets the domain to the correct value, user specified domain', () => {
      (dimension as any).domain = ['c', 'd', 'b', 'a', 'd'];
      dimension.setPropertiesFromData(['a', 'b', 'c', 'a', 'b']);
      expect((dimension as any).calculatedDomain).toEqual(['c', 'd', 'b', 'a']);
    });
  });

  describe('integration: domainIncludes', () => {
    it('correctly sets internSetDomain and domainIncludes returns correct value', () => {
      (dimension as any).domain = ['c', 'd', 'b', 'a', 'd'];
      dimension.setPropertiesFromData(['a', 'b', 'c', 'a', 'b']);
      expect(dimension.domainIncludes('a')).toEqual(true);
    });
    it('correctly sets internSetDomain and domainIncludes returns correct value - scenario 2', () => {
      (dimension as any).domain = ['c', 'd', 'b', 'a', 'd'];
      dimension.setPropertiesFromData(['a', 'b', 'c', 'a', 'b']);
      expect(dimension.domainIncludes('z')).toEqual(false);
    });
  });
});

/* eslint-disable @typescript-eslint/no-explicit-any */
import { interpolateLab } from 'd3';
import { CalculatedRangeBinsAttributeDataDimension } from './calculated-bins';

class ConcreteCalculatedBins extends CalculatedRangeBinsAttributeDataDimension<
  any,
  string
> {
  protected override setDomain(): void {
    return;
  }
  override getScale() {
    return;
  }
  override setPropertiesFromData(): void {
    return;
  }
}

describe('CalculatedRangeBinsAttributeDataDimension', () => {
  let dimension: ConcreteCalculatedBins;
  beforeEach(() => {
    dimension = new ConcreteCalculatedBins();
  });
  describe('integration: setRange', () => {
    it('sets the range to the correct values/length', () => {
      (dimension as any).calculatedNumBins = 3;
      dimension.range = ['red', 'blue', 'yellow', 'green'];
      dimension.interpolator = interpolateLab;
      (dimension as any).setRange();
      expect(dimension.range.length).toEqual(3);
    });
  });
  describe('shouldCalculateBinColors', () => {
    it('returns true when numBins is greater than 1 and colors length is not equal to numBins - colors are fewer', () => {
      expect((dimension as any).shouldCalculateBinColors(2, ['red'])).toBe(
        true
      );
    });
    it('returns true when numBins is greater than 1 and colors length is not equal to numBins - colors are greater', () => {
      expect(
        (dimension as any).shouldCalculateBinColors(2, [
          'red',
          'blue',
          'yellow',
        ])
      ).toBe(true);
    });
    it('returns false when numBins is 1', () => {
      expect((dimension as any).shouldCalculateBinColors(1, ['red'])).toBe(
        false
      );
    });
    it('returns false when colors length is equal to numBins', () => {
      expect(
        (dimension as any).shouldCalculateBinColors(2, ['red', 'blue'])
      ).toBe(false);
    });
  });
});

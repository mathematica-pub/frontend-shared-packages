/* eslint-disable @typescript-eslint/no-explicit-any */
import { NumberVisualValueDimension } from './number-visual-value';
import { NumberVisualValueDimensionBuilder } from './number-visual-value-builder';

describe('NumberChartPositionDimension', () => {
  let dimension: NumberVisualValueDimension<number, number>;
  beforeEach(() => {
    dimension = new NumberVisualValueDimensionBuilder<number, number>()
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
      dimension.setPropertiesFromData([1, 2, 3, 4, 5]);
      expect((dimension as any).setValues).toHaveBeenCalledOnceWith([
        1, 2, 3, 4, 5,
      ]);
    });
    it('calls setDomain once', () => {
      dimension.setPropertiesFromData([1, 2, 3, 4, 5]);
      expect((dimension as any).setDomain).toHaveBeenCalledTimes(1);
    });
    it('calls setScale once', () => {
      dimension.setPropertiesFromData([1, 2, 3, 4, 5]);
      expect((dimension as any).setScale).toHaveBeenCalledTimes(1);
    });
  });
});

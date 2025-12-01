/* eslint-disable @typescript-eslint/no-explicit-any */
import { NumberChartPositionDimension } from './number-chart-position';
import { NumberChartPositionDimensionBuilder } from './number-chart-position-builder';

describe('NumberChartPositionDimension', () => {
  let dimension: NumberChartPositionDimension<number>;
  beforeEach(() => {
    dimension = new NumberChartPositionDimensionBuilder<number>()
      .valueAccessor((d) => d)
      ._build('Test');
  });
  describe('setPropertiesFromData', () => {
    beforeEach(() => {
      spyOn(dimension as any, 'setValues');
      spyOn(dimension as any, 'setDomain');
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
  });
});

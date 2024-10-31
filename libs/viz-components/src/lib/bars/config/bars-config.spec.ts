/* eslint-disable @typescript-eslint/no-explicit-any */
import { OrdinalChartPositionDimension } from '../../data-dimensions/ordinal/ordinal-chart-position/ordinal-chart-position';
import { OrdinalVisualValueDimension } from '../../data-dimensions/ordinal/ordinal-visual-value/ordinal-visual-value';
import { NumberChartPositionDimension } from '../../data-dimensions/quantitative/number-chart-position/number-chart-position';
import { VicBarsConfigBuilder } from './bars-builder';
import { BarsConfig } from './bars-config';

type Datum = { value: number; state: string };
const data = [
  { value: 1, state: 'AL' },
  { value: 2, state: 'AK' },
  { value: 3, state: 'AZ' },
  { value: 4, state: 'CA' },
  { value: 5, state: 'CO' },
  { value: 6, state: 'CO' },
];
function getNewConfig(): BarsConfig<Datum, string> {
  return new VicBarsConfigBuilder<Datum, string>()
    .data(data)
    .orientation('horizontal')
    .createQuantitativeDimension((dimension) =>
      dimension.valueAccessor((d) => d.value)
    )
    .createOrdinalDimension((dimension) =>
      dimension.valueAccessor((d) => d.state)
    )
    .getConfig();
}

describe('BarsConfig', () => {
  let config: BarsConfig<Datum, string>;

  describe('init()', () => {
    beforeEach(() => {
      spyOn(BarsConfig.prototype as any, 'setDimensionPropertiesFromData');
      spyOn(BarsConfig.prototype as any, 'setValueIndices');
      spyOn(BarsConfig.prototype as any, 'setHasNegativeValues');
      spyOn(BarsConfig.prototype as any, 'setBarsKeyFunction');
      config = getNewConfig();
    });
    it('calls setDimensionPropertiesFromData once', () => {
      expect(
        (config as any).setDimensionPropertiesFromData
      ).toHaveBeenCalledTimes(1);
    });
    it('calls setValueIndices once', () => {
      expect((config as any).setValueIndices).toHaveBeenCalledTimes(1);
    });
    it('calls setHasNegativeValues once', () => {
      expect((config as any).setHasNegativeValues).toHaveBeenCalledTimes(1);
    });
    it('calls setBarsKeyFunction once', () => {
      expect((config as any).setBarsKeyFunction).toHaveBeenCalledTimes(1);
    });
  });

  describe('setDimensionPropertiesFromData()', () => {
    beforeEach(() => {
      spyOn(BarsConfig.prototype as any, 'initPropertiesFromData');
      spyOn(
        NumberChartPositionDimension.prototype as any,
        'setPropertiesFromData'
      );
      spyOn(
        OrdinalChartPositionDimension.prototype as any,
        'setPropertiesFromData'
      );
      spyOn(
        OrdinalVisualValueDimension.prototype as any,
        'setPropertiesFromData'
      );
      config = getNewConfig();
      (config as any).setDimensionPropertiesFromData();
    });
    it('calls quantitative.setPropertiesFromData once', () => {
      expect(
        config.quantitative.setPropertiesFromData
      ).toHaveBeenCalledOnceWith(data);
    });
    it('calls ordinal.setPropertiesFromData once', () => {
      expect(config.ordinal.setPropertiesFromData).toHaveBeenCalledOnceWith(
        data,
        true
      );
    });
    it('calls categorical.setPropertiesFromData once', () => {
      expect(config.categorical.setPropertiesFromData).toHaveBeenCalledOnceWith(
        data
      );
    });
  });

  describe('setValueIndices()', () => {
    beforeEach(() => {
      spyOn(BarsConfig.prototype as any, 'initPropertiesFromData');
    });
    it('returns the value indices of datums with unique ordinal values', () => {
      config = getNewConfig();
      (config as any).setDimensionPropertiesFromData();
      (config as any).setValueIndices();
      expect(config.valueIndices).toEqual([0, 1, 2, 3, 4]);
    });
    it('sets valueIndices to the correct array when ordinal domain is limited by user', () => {
      config = new VicBarsConfigBuilder<Datum, string>()
        .data(data)
        .orientation('horizontal')
        .createQuantitativeDimension((dimension) =>
          dimension.valueAccessor((d) => d.value)
        )
        .createOrdinalDimension((dimension) =>
          dimension.valueAccessor((d) => d.state).domain(['AL', 'AZ', 'CA'])
        )
        .getConfig();
      (config as any).setDimensionPropertiesFromData();
      (config as any).setValueIndices();
      expect(config.valueIndices).toEqual([0, 2, 3]);
    });
  });

  describe('setHasNegativeValues()', () => {
    beforeEach(() => {
      spyOn(BarsConfig.prototype as any, 'initPropertiesFromData');
      config = getNewConfig();
    });
    it('returns false if all values are positive', () => {
      config.quantitative.values = [1, 2, 3, 4, 5];
      (config as any).setHasNegativeValues();
      expect(config.hasNegativeValues).toBeFalse();
    });
    it('returns true if any values are negative', () => {
      config.quantitative.values = [1, 2, -3, 4, 5];
      (config as any).setHasNegativeValues();
      expect(config.hasNegativeValues).toBeTrue();
    });
  });
});

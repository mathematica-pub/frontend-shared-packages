/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vic } from '../../config/vic';
import { VicCategoricalDimension } from '../../data-dimensions/categorical-dimension';
import { VicOrdinalDimension } from '../../data-dimensions/ordinal-dimension';
import { VicQuantitativeDimension } from '../../data-dimensions/quantitative-dimension';
import { VicBarsConfig } from './bars.config';

type Datum = { value: number; state: string };
const data = [
  { value: 1, state: 'AL' },
  { value: 2, state: 'AK' },
  { value: 3, state: 'AZ' },
  { value: 4, state: 'CA' },
  { value: 5, state: 'CO' },
  { value: 6, state: 'CO' },
];
function getNewConfig(): VicBarsConfig<Datum, string> {
  return Vic.barsHorizontal<Datum, string>({
    data,
    quantitative: Vic.dimensionQuantitative<Datum>({
      valueAccessor: (d) => d.value,
    }),
    ordinal: Vic.dimensionOrdinal<Datum, string>({
      valueAccessor: (d) => d.state,
    }),
    categorical: Vic.dimensionCategorical<Datum, string>({}),
  });
}

describe('BarsConfig', () => {
  let config: VicBarsConfig<Datum, string>;
  beforeEach(() => {
    config = undefined;
  });

  describe('initPropertiesFromData()', () => {
    beforeEach(() => {
      spyOn(VicBarsConfig.prototype as any, 'setDimensionPropertiesFromData');
      spyOn(VicBarsConfig.prototype as any, 'setValueIndicies');
      spyOn(VicBarsConfig.prototype as any, 'setHasNegativeValues');
      spyOn(VicBarsConfig.prototype as any, 'setBarsKeyFunction');
      config = getNewConfig();
    });
    it('calls setDimensionPropertiesFromData once', () => {
      expect(
        (config as any).setDimensionPropertiesFromData
      ).toHaveBeenCalledTimes(1);
    });
    it('calls setValueIndicies once', () => {
      expect((config as any).setValueIndicies).toHaveBeenCalledTimes(1);
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
      spyOn(VicBarsConfig.prototype as any, 'initPropertiesFromData');
      spyOn(VicQuantitativeDimension.prototype as any, 'setPropertiesFromData');
      spyOn(VicOrdinalDimension.prototype as any, 'setPropertiesFromData');
      spyOn(VicCategoricalDimension.prototype as any, 'setPropertiesFromData');
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

  describe('setValueIndicies()', () => {
    beforeEach(() => {
      spyOn(VicBarsConfig.prototype as any, 'initPropertiesFromData');
    });
    it('returns the value indicies of datums with unique ordinal values', () => {
      config = getNewConfig();
      (config as any).setDimensionPropertiesFromData();
      (config as any).setValueIndicies();
      expect(config.valueIndicies).toEqual([0, 1, 2, 3, 4]);
    });
    it('sets valueIndicies to the correct array when ordinal domain is limited by user', () => {
      config = Vic.barsHorizontal({
        data,
        quantitative: Vic.dimensionQuantitative<Datum>({
          valueAccessor: (d) => d.value,
        }),
        ordinal: Vic.dimensionOrdinal<Datum, string>({
          valueAccessor: (d) => d.state,
          domain: ['AL', 'AZ', 'CA'],
        }),
        categorical: Vic.dimensionCategorical<Datum, string>({}),
      });
      (config as any).setDimensionPropertiesFromData();
      (config as any).setValueIndicies();
      expect(config.valueIndicies).toEqual([0, 2, 3]);
    });
  });

  describe('setHasNegativeValues()', () => {
    beforeEach(() => {
      spyOn(VicBarsConfig.prototype as any, 'initPropertiesFromData');
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

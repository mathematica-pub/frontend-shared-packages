/* eslint-disable @typescript-eslint/no-explicit-any */
import { vicCategoricalDimension } from '../../data-marks/dimensions/categorical-dimension';
import { vicOrdinalDimension } from '../../data-marks/dimensions/ordinal-dimension';
import { vicQuantitativeDimension } from '../../data-marks/dimensions/quantitative-dimension';
import { HORIZONTAL_BARS_DIMENSIONS } from './bars-dimensions';
import { VicBarsConfig } from './bars.config';

type Datum = { value: number; state: string };

describe('BarsConfig', () => {
  let config: VicBarsConfig<Datum, string>;
  const data = [
    { value: 1, state: 'AL' },
    { value: 2, state: 'AK' },
    { value: 3, state: 'AZ' },
    { value: 4, state: 'CA' },
    { value: 5, state: 'CO' },
    { value: 6, state: 'CO' },
  ];
  beforeEach(() => {
    config = new VicBarsConfig(HORIZONTAL_BARS_DIMENSIONS, {
      data,
      quantitative: vicQuantitativeDimension<Datum>({}),
      ordinal: vicOrdinalDimension<Datum, string>({}),
      categorical: vicCategoricalDimension<Datum, string>({}),
    });
  });

  describe('setPropertiesFromData()', () => {
    beforeEach(() => {
      spyOn(config as any, 'setDimensionPropertiesFromData');
      spyOn(config as any, 'setValueIndicies');
      spyOn(config as any, 'setHasBarsWithNegativeValues');
      spyOn(config as any, 'setBarsKeyFunction');
      config.initPropertiesFromData();
    });
    it('calls setDimensionPropertiesFromData once', () => {
      expect(
        (config as any).setDimensionPropertiesFromData
      ).toHaveBeenCalledTimes(1);
    });
    it('calls setValueIndicies once', () => {
      expect((config as any).setValueIndicies).toHaveBeenCalledTimes(1);
    });
    it('calls setHasBarsWithNegativeValues once', () => {
      expect(
        (config as any).setHasBarsWithNegativeValues
      ).toHaveBeenCalledTimes(1);
    });
    it('calls setBarsKeyFunction once', () => {
      expect((config as any).setBarsKeyFunction).toHaveBeenCalledTimes(1);
    });
  });

  describe('setDimensionPropertiesFromData()', () => {
    beforeEach(() => {
      spyOn(config.quantitative, 'setPropertiesFromData');
      spyOn(config.ordinal, 'setPropertiesFromData');
      spyOn(config.categorical, 'setPropertiesFromData');
      spyOn(config as any, 'setValueIndicies');
      spyOn(config as any, 'setHasBarsWithNegativeValues');
      spyOn(config as any, 'setBarsKeyFunction');
      config.initPropertiesFromData();
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
      config.ordinal.values = ['AL', 'AK', 'AZ', 'CA', 'CO'];
      spyOn(config.ordinal, 'domainIncludes').and.returnValue(true);
      (config as any).setValueIndicies();
    });
    it('returns the value indicies', () => {
      expect(config.valueIndicies).toEqual([0, 1, 2, 3, 4]);
    });
  });

  describe('setHasBarsWithNegativeValues()', () => {
    it('returns false if all values are positive', () => {
      config.quantitative.values = [1, 2, 3, 4, 5];
      (config as any).setHasBarsWithNegativeValues();
      expect(config.hasBarsWithNegativeValues).toBeFalse();
    });
    it('returns true if any values are negative', () => {
      config.quantitative.values = [1, 2, -3, 4, 5];
      (config as any).setHasBarsWithNegativeValues();
      expect(config.hasBarsWithNegativeValues).toBeTrue();
    });
  });
});

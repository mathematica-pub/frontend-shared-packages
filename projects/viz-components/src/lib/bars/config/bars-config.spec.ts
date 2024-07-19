/* eslint-disable @typescript-eslint/no-explicit-any */
import { VicDimensionCategorical } from '../../data-dimensions/categorical/categorical';
import { VicDimensionOrdinal } from '../../data-dimensions/ordinal/ordinal';
import { VicDimensionQuantitativeNumeric } from '../../data-dimensions/quantitative/quantitative-numeric';
import { VicBarsBuilder } from './bars-builder';
import { VicBarsConfig } from './bars-config';

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
  return new VicBarsBuilder<Datum, string>()
    .data(data)
    .createQuantitativeDimension((dimension) =>
      dimension.valueAccessor((d) => d.value)
    )
    .createOrdinalDimension((dimension) =>
      dimension.valueAccessor((d) => d.state)
    )
    .build();
}

describe('BarsConfig', () => {
  let config: VicBarsConfig<Datum, string>;
  beforeEach(() => {
    config = undefined;
  });

  describe('init()', () => {
    beforeEach(() => {
      spyOn(VicBarsConfig.prototype as any, 'setDimensionPropertiesFromData');
      spyOn(VicBarsConfig.prototype as any, 'setValueIndices');
      spyOn(VicBarsConfig.prototype as any, 'setHasNegativeValues');
      spyOn(VicBarsConfig.prototype as any, 'setBarsKeyFunction');
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
      spyOn(VicBarsConfig.prototype as any, 'initPropertiesFromData');
      spyOn(
        VicDimensionQuantitativeNumeric.prototype as any,
        'setPropertiesFromData'
      );
      spyOn(VicDimensionOrdinal.prototype as any, 'setPropertiesFromData');
      spyOn(VicDimensionCategorical.prototype as any, 'setPropertiesFromData');
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
      spyOn(VicBarsConfig.prototype as any, 'initPropertiesFromData');
    });
    it('returns the value indices of datums with unique ordinal values', () => {
      config = getNewConfig();
      (config as any).setDimensionPropertiesFromData();
      (config as any).setValueIndices();
      expect(config.valueIndices).toEqual([0, 1, 2, 3, 4]);
    });
    it('sets valueIndices to the correct array when ordinal domain is limited by user', () => {
      config = new VicBarsBuilder<Datum, string>()
        .data(data)
        .createQuantitativeDimension((dimension) =>
          dimension.valueAccessor((d) => d.value)
        )
        .createOrdinalDimension((dimension) =>
          dimension.valueAccessor((d) => d.state).domain(['AL', 'AZ', 'CA'])
        )
        .build();
      (config as any).setDimensionPropertiesFromData();
      (config as any).setValueIndices();
      expect(config.valueIndices).toEqual([0, 2, 3]);
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

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vic } from '../../config/vic';
import { VicStackedBarsConfig } from './stacked-bars-config';

type Datum = { country: string; value: number; category: string };
const data = [
  { country: 'Sweden', value: 1, category: 'a' },
  { country: 'Finland', value: 2, category: 'a' },
  { country: 'Norway', value: 3, category: 'a' },
  { country: 'Iceland', value: 4, category: 'b' },
  { country: 'Denmark', value: 5, category: 'b' },
  { country: 'Russia', value: 6, category: 'b' },
];

function getNewConfig(): VicStackedBarsConfig<Datum, string> {
  return Vic.stackedBarsHorizontal<Datum, string>({
    data,
    ordinal: Vic.dimensionOrdinal<Datum, string>({
      valueAccessor: (d) => d.country,
    }),
    quantitative: Vic.dimensionQuantitativeNumeric<Datum>({
      valueAccessor: (d) => d.value,
    }),
    categorical: Vic.dimensionCategorical<Datum, string>({
      valueAccessor: (d) => d.category,
    }),
  });
}
describe('StackedBarsConfig', () => {
  let config: VicStackedBarsConfig<Datum, string>;
  beforeEach(() => {
    config = undefined;
  });

  describe('initPropertiesFromData()', () => {
    beforeEach(() => {
      spyOn(
        VicStackedBarsConfig.prototype as any,
        'setDimensionPropertiesFromData'
      );
      spyOn(VicStackedBarsConfig.prototype as any, 'setValueIndices');
      spyOn(VicStackedBarsConfig.prototype as any, 'setHasNegativeValues');
      spyOn(VicStackedBarsConfig.prototype as any, 'constructStackedData');
      spyOn(
        VicStackedBarsConfig.prototype as any,
        'initQuantitativeDomainFromStack'
      );
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
    it('calls constructStackedData once', () => {
      expect((config as any).constructStackedData).toHaveBeenCalledTimes(1);
    });
    it('calls initQuantitativeDomainFromStack once', () => {
      expect(
        (config as any).initQuantitativeDomainFromStack
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('setValueIndices()', () => {
    it('returns an array of indices when ordinal and categorical domains are not specified by user', () => {
      config = getNewConfig();
      expect(config.valueIndices).toEqual([0, 1, 2, 3, 4, 5]);
    });
    it('returns an array of indices when ordinal domain is limited by user', () => {
      config = Vic.stackedBarsHorizontal<Datum, string>({
        data,
        ordinal: Vic.dimensionOrdinal<Datum, string>({
          valueAccessor: (d) => d.country,
          domain: ['Sweden', 'Norway', 'Iceland'],
        }),
        quantitative: Vic.dimensionQuantitativeNumeric<Datum>({
          valueAccessor: (d) => d.value,
        }),
        categorical: Vic.dimensionCategorical<Datum, string>({
          valueAccessor: (d) => d.category,
        }),
      });
      expect(config.valueIndices).toEqual([0, 2, 3]);
    });
    it('returns an array of indices when categorical domain is limited by user', () => {
      config = Vic.stackedBarsHorizontal<Datum, string>({
        data,
        ordinal: Vic.dimensionOrdinal<Datum, string>({
          valueAccessor: (d) => d.country,
        }),
        quantitative: Vic.dimensionQuantitativeNumeric<Datum>({
          valueAccessor: (d) => d.value,
        }),
        categorical: Vic.dimensionCategorical<Datum, string>({
          valueAccessor: (d) => d.category,
          domain: ['a'],
        }),
      });
      expect(config.valueIndices).toEqual([0, 1, 2]);
    });
    it('returns an array of indices when both ordinal and categorical domains are limited by user', () => {
      config = Vic.stackedBarsHorizontal<Datum, string>({
        data,
        ordinal: Vic.dimensionOrdinal<Datum, string>({
          valueAccessor: (d) => d.country,
          domain: ['Sweden', 'Norway', 'Iceland'],
        }),
        quantitative: Vic.dimensionQuantitativeNumeric<Datum>({
          valueAccessor: (d) => d.value,
        }),
        categorical: Vic.dimensionCategorical<Datum, string>({
          valueAccessor: (d) => d.category,
          domain: ['a'],
        }),
      });
      expect(config.valueIndices).toEqual([0, 2]);
    });
  });
});

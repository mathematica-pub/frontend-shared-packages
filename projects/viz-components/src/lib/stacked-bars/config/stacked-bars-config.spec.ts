/* eslint-disable @typescript-eslint/no-explicit-any */
import { VicStackedBarsBuilder } from './stacked-bars-builder';
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
  return new VicStackedBarsBuilder<Datum, string>()
    .orientation('horizontal')
    .data(data)
    .createOrdinalDimension((dimension) =>
      dimension.valueAccessor((d) => d.country)
    )
    .createQuantitativeDimension((dimension) =>
      dimension.valueAccessor((d) => d.value)
    )
    .createCategoricalDimension((dimension) =>
      dimension.valueAccessor((d) => d.category)
    )
    .build();
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
      config = new VicStackedBarsBuilder<Datum, string>()
        .orientation('horizontal')
        .data(data)
        .createOrdinalDimension((dimension) =>
          dimension
            .valueAccessor((d) => d.country)
            .domain(['Sweden', 'Norway', 'Iceland'])
        )
        .createQuantitativeDimension((dimension) =>
          dimension.valueAccessor((d) => d.value)
        )
        .createCategoricalDimension((dimension) =>
          dimension.valueAccessor((d) => d.category)
        )
        .build();
      expect(config.valueIndices).toEqual([0, 2, 3]);
    });
    it('returns an array of indices when categorical domain is limited by user', () => {
      config = new VicStackedBarsBuilder<Datum, string>()
        .orientation('horizontal')
        .data(data)
        .createOrdinalDimension((dimension) =>
          dimension.valueAccessor((d) => d.country)
        )
        .createQuantitativeDimension((dimension) =>
          dimension.valueAccessor((d) => d.value)
        )
        .createCategoricalDimension((dimension) =>
          dimension.valueAccessor((d) => d.category).domain(['a'])
        )
        .build();
      expect(config.valueIndices).toEqual([0, 1, 2]);
    });
    it('returns an array of indices when both ordinal and categorical domains are limited by user', () => {
      config = new VicStackedBarsBuilder<Datum, string>()
        .orientation('horizontal')
        .data(data)
        .createOrdinalDimension((dimension) =>
          dimension
            .valueAccessor((d) => d.country)
            .domain(['Sweden', 'Norway', 'Iceland'])
        )
        .createQuantitativeDimension((dimension) =>
          dimension.valueAccessor((d) => d.value)
        )
        .createCategoricalDimension((dimension) =>
          dimension.valueAccessor((d) => d.category).domain(['a'])
        )
        .build();
      expect(config.valueIndices).toEqual([0, 2]);
    });
  });
});

/* eslint-disable @typescript-eslint/no-explicit-any */
import { VicStackedBarsConfigBuilder } from './stacked-bars-builder';
import { StackedBarsConfig } from './stacked-bars-config';

type Datum = { country: string; value: number; category: string };
const data = [
  { country: 'Sweden', value: 1, category: 'a' },
  { country: 'Finland', value: 2, category: 'a' },
  { country: 'Norway', value: 3, category: 'a' },
  { country: 'Iceland', value: 4, category: 'b' },
  { country: 'Denmark', value: 5, category: 'b' },
  { country: 'Russia', value: 6, category: 'b' },
];

function getNewConfig(): StackedBarsConfig<Datum, string> {
  return new VicStackedBarsConfigBuilder<Datum, string>()
    .data(data)
    .horizontal((bars) =>
      bars
        .x((dimension) => dimension.valueAccessor((d) => d.value))
        .y((dimension) => dimension.valueAccessor((d) => d.country))
    )
    .color((dimension) => dimension.valueAccessor((d) => d.category))
    .getConfig();
}
describe('StackedBarsConfig', () => {
  let config: StackedBarsConfig<Datum, string>;
  describe('initPropertiesFromData()', () => {
    beforeEach(() => {
      spyOn(
        StackedBarsConfig.prototype as any,
        'setDimensionPropertiesFromData'
      );
      spyOn(StackedBarsConfig.prototype as any, 'setValueIndices');
      spyOn(StackedBarsConfig.prototype as any, 'setHasNegativeValues');
      spyOn(StackedBarsConfig.prototype as any, 'constructStackedData');
      spyOn(
        StackedBarsConfig.prototype as any,
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
      config = new VicStackedBarsConfigBuilder<Datum, string>()
        .data(data)
        .horizontal((bars) =>
          bars
            .x((dimension) => dimension.valueAccessor((d) => d.value))
            .y((dimension) =>
              dimension
                .valueAccessor((d) => d.country)
                .domain(['Sweden', 'Norway', 'Iceland'])
            )
        )
        .color((dimension) => dimension.valueAccessor((d) => d.category))
        .getConfig();
      expect(config.valueIndices).toEqual([0, 2, 3]);
    });
    it('returns an array of indices when categorical domain is limited by user', () => {
      config = new VicStackedBarsConfigBuilder<Datum, string>()
        .data(data)
        .horizontal((bars) =>
          bars
            .x((dimension) => dimension.valueAccessor((d) => d.value))
            .y((dimension) => dimension.valueAccessor((d) => d.country))
        )
        .color((dimension) =>
          dimension.valueAccessor((d) => d.category).domain(['a'])
        )
        .getConfig();
      expect(config.valueIndices).toEqual([0, 1, 2]);
    });
    it('returns an array of indices when both ordinal and categorical domains are limited by user', () => {
      config = new VicStackedBarsConfigBuilder<Datum, string>()
        .data(data)
        .horizontal((bars) =>
          bars
            .x((dimension) => dimension.valueAccessor((d) => d.value))
            .y((dimension) =>
              dimension
                .valueAccessor((d) => d.country)
                .domain(['Sweden', 'Norway', 'Iceland'])
            )
        )
        .color((dimension) =>
          dimension.valueAccessor((d) => d.category).domain(['a'])
        )
        .getConfig();
      expect(config.valueIndices).toEqual([0, 2]);
    });
  });
});

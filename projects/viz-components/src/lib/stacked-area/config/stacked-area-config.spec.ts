/* eslint-disable @typescript-eslint/no-explicit-any */
import { VicDimensionCategorical } from '../../data-dimensions/categorical/categorical';
import { VicDimensionQuantitativeDate } from '../../data-dimensions/quantitative/quantitative-date';
import { VicDimensionQuantitativeNumeric } from '../../data-dimensions/quantitative/quantitative-numeric';
import { VicStackedAreaBuilder } from './stacked-area-builder';
import { VicStackedAreaConfig } from './stacked-area-config';

type Datum = { date: Date; value: number; category: string };
const data = [
  { date: new Date('2020-01-01'), value: 1, category: 'a' },
  { date: new Date('2020-01-02'), value: 2, category: 'a' },
  { date: new Date('2020-01-03'), value: 3, category: 'a' },
  { date: new Date('2020-01-01'), value: 4, category: 'b' },
  { date: new Date('2020-01-02'), value: 5, category: 'b' },
  { date: new Date('2020-01-03'), value: 6, category: 'b' },
];
function createConfig(): VicStackedAreaConfig<Datum, string> {
  return new VicStackedAreaBuilder<Datum, string>()
    .data(data)
    .createXDateDimension((dimension) => dimension.valueAccessor((d) => d.date))
    .createYDimension((dimension) => dimension.valueAccessor((d) => d.value))
    .createCategoricalDimension((dimension) =>
      dimension.valueAccessor((d) => d.category)
    )
    .build();
}

describe('StackedAreaConfig', () => {
  let config: VicStackedAreaConfig<Datum, string>;
  beforeEach(() => {
    config = undefined;
  });
  describe('initPropertiesFromData()', () => {
    beforeEach(() => {
      spyOn(
        VicStackedAreaConfig.prototype as any,
        'setDimensionPropertiesFromData'
      );
      spyOn(VicStackedAreaConfig.prototype as any, 'setValueIndicies');
      spyOn(VicStackedAreaConfig.prototype as any, 'setSeries');
      spyOn(
        VicStackedAreaConfig.prototype as any,
        'initQuantitativeDomainFromStack'
      );
      config = createConfig();
    });
    it('calls setDimensionPropertiesFromData once', () => {
      expect(
        (config as any).setDimensionPropertiesFromData
      ).toHaveBeenCalledTimes(1);
    });
    it('calls setValueIndicies once', () => {
      expect((config as any).setValueIndicies).toHaveBeenCalledTimes(1);
    });
    it('calls setSeries once', () => {
      expect((config as any).setSeries).toHaveBeenCalledTimes(1);
    });
    it('calls initQuantitativeDomainFromStack once', () => {
      expect(
        (config as any).initQuantitativeDomainFromStack
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('setDimensionPropertiesFromData()', () => {
    beforeEach(() => {
      spyOn(VicStackedAreaConfig.prototype as any, 'initPropertiesFromData');
      spyOn(VicDimensionQuantitativeDate.prototype, 'setPropertiesFromData');
      spyOn(VicDimensionQuantitativeNumeric.prototype, 'setPropertiesFromData');
      spyOn(VicDimensionCategorical.prototype, 'setPropertiesFromData');
      config = createConfig();
      (config as any).setDimensionPropertiesFromData();
    });
    it('calls x.setPropertiesFromData once', () => {
      expect(config.x.setPropertiesFromData).toHaveBeenCalledTimes(1);
    });
    it('calls y.setPropertiesFromData once', () => {
      expect(config.y.setPropertiesFromData).toHaveBeenCalledTimes(1);
    });
    it('calls categorical.setPropertiesFromData once', () => {
      expect(config.categorical.setPropertiesFromData).toHaveBeenCalledTimes(1);
    });
  });

  describe('setValueIndicies()', () => {
    beforeEach(() => {
      spyOn(VicStackedAreaConfig.prototype as any, 'initPropertiesFromData');
    });
    it('sets valueIndicies to an array of length 6', () => {
      config = createConfig();
      (config as any).setDimensionPropertiesFromData();
      (config as any).setValueIndicies();
      expect(config.valueIndices).toEqual([0, 1, 2, 3, 4, 5]);
    });
    it('sets valueIndicies to an array of length 3 if categorical domain is limited by user', () => {
      config = new VicStackedAreaBuilder<Datum, string>()
        .data(data)
        .createXDateDimension((dimension) =>
          dimension.valueAccessor((d) => d.date)
        )
        .createYDimension((dimension) =>
          dimension.valueAccessor((d) => d.value)
        )
        .createCategoricalDimension((dimension) =>
          dimension.valueAccessor((d) => d.category).domain(['a'])
        )
        .build();
      (config as any).setDimensionPropertiesFromData();
      (config as any).setValueIndicies();
      expect(config.valueIndices).toEqual([0, 1, 2]);
    });
  });
});

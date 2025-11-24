/* eslint-disable @typescript-eslint/no-explicit-any */
import { DateChartPositionDimension } from '../../data-dimensions/continuous-quantitative/date-chart-position/date-chart-position';
import { NumberChartPositionDimension } from '../../data-dimensions/continuous-quantitative/number-chart-position/number-chart-position';
import { OrdinalVisualValueDimension } from '../../data-dimensions/ordinal/ordinal-visual-value/ordinal-visual-value';
import { VicStackedAreaConfigBuilder } from './stacked-area-builder';
import { StackedAreaConfig } from './stacked-area-config';

type Datum = { date: Date; value: number; category: string };
const data = [
  { date: new Date('2020-01-01'), value: 1, category: 'a' },
  { date: new Date('2020-01-02'), value: 2, category: 'a' },
  { date: new Date('2020-01-03'), value: 3, category: 'a' },
  { date: new Date('2020-01-01'), value: 4, category: 'b' },
  { date: new Date('2020-01-02'), value: 5, category: 'b' },
  { date: new Date('2020-01-03'), value: 6, category: 'b' },
];
function createConfig(): StackedAreaConfig<Datum, string> {
  return new VicStackedAreaConfigBuilder<Datum, string>()
    .data(data)
    .xDate((dimension) => dimension.valueAccessor((d) => d.date))
    .y((dimension) => dimension.valueAccessor((d) => d.value))
    .color((dimension) => dimension.valueAccessor((d) => d.category))
    .getConfig();
}

describe('StackedAreaConfig', () => {
  let config: StackedAreaConfig<Datum, string>;
  beforeEach(() => {
    config = undefined;
  });
  describe('initPropertiesFromData()', () => {
    beforeEach(() => {
      spyOn(
        StackedAreaConfig.prototype as any,
        'setDimensionPropertiesFromData'
      );
      spyOn(StackedAreaConfig.prototype as any, 'setValueIndicies');
      spyOn(StackedAreaConfig.prototype as any, 'setSeries');
      spyOn(
        StackedAreaConfig.prototype as any,
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
      spyOn(StackedAreaConfig.prototype as any, 'initPropertiesFromData');
      spyOn(DateChartPositionDimension.prototype, 'setPropertiesFromData');
      spyOn(NumberChartPositionDimension.prototype, 'setPropertiesFromData');
      spyOn(OrdinalVisualValueDimension.prototype, 'setPropertiesFromData');
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
      expect(config.color.setPropertiesFromData).toHaveBeenCalledTimes(1);
    });
  });

  describe('setValueIndicies()', () => {
    beforeEach(() => {
      spyOn(StackedAreaConfig.prototype as any, 'initPropertiesFromData');
    });
    it('sets valueIndicies to an array of length 6', () => {
      config = createConfig();
      (config as any).setDimensionPropertiesFromData();
      (config as any).setValueIndicies();
      expect(config.valueIndices).toEqual([0, 1, 2, 3, 4, 5]);
    });
    it('sets valueIndicies to an array of length 3 if categorical domain is limited by user', () => {
      config = new VicStackedAreaConfigBuilder<Datum, string>()
        .data(data)
        .xDate((dimension) => dimension.valueAccessor((d) => d.date))
        .y((dimension) => dimension.valueAccessor((d) => d.value))
        .color((dimension) =>
          dimension.valueAccessor((d) => d.category).domain(['a'])
        )
        .getConfig();
      (config as any).setDimensionPropertiesFromData();
      (config as any).setValueIndicies();
      expect(config.valueIndices).toEqual([0, 1, 2]);
    });
  });
});

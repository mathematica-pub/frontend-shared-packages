/* eslint-disable @typescript-eslint/no-explicit-any */
import { NumberChartPositionDimension } from '../../data-dimensions/continuous-quantitative/number-chart-position/number-chart-position';
import { NumberVisualValueDimension } from '../../data-dimensions/continuous-quantitative/number-visual-value/number-visual-value';
import { OrdinalVisualValueDimension } from '../../data-dimensions/ordinal/ordinal-visual-value/ordinal-visual-value';
import { VicDotsConfigBuilder } from './dots-builder';
import { DotsConfig } from './dots-config';

type Datum = { rain: number; snow: number; state: string; year: number };
const testData = [
  { rain: 50, snow: 2, state: 'AL', year: 2020 },
  { rain: 54, snow: 1, state: 'AL', year: 2021 },
  { rain: 66, snow: 82, state: 'AK', year: 2020 },
  { rain: 45, snow: 53, state: 'AK', year: 2021 },
  { rain: 24, snow: 18, state: 'AZ', year: 2020 },
  { rain: 17, snow: 25, state: 'AZ', year: 2021 },
  { rain: 58, snow: 36, state: 'CA', year: 2020 },
  { rain: 66, snow: 50, state: 'CA', year: 2021 },
  { rain: 37, snow: 42, state: 'CO', year: 2020 },
  { rain: 49, snow: 63, state: 'CO', year: 2021 },
];

function getNewConfig(data: Datum[]): DotsConfig<Datum> {
  return new VicDotsConfigBuilder<Datum>()
    .data(data)
    .xNumeric((x) => x.valueAccessor((d) => d.year))
    .yNumeric((y) => y.valueAccessor((d) => d.rain))
    .radiusNumeric((radius) =>
      radius.valueAccessor((d) => d.snow).range([1, 12])
    )
    .fillCategorical((fill) =>
      fill
        .valueAccessor((d) => d.state)
        .range(['red', 'blue', 'green', 'yellow', 'purple'])
    )
    .getConfig();
}

describe('DotsConfig', () => {
  let config: DotsConfig<Datum>;

  describe('init()', () => {
    beforeEach(() => {
      spyOn(DotsConfig.prototype as any, 'setDimensionPropertiesFromData');
      spyOn(DotsConfig.prototype as any, 'setValueIndices');
      config = getNewConfig(testData);
    });
    it('calls setDimensionPropertiesFromData once', () => {
      expect(
        (config as any).setDimensionPropertiesFromData
      ).toHaveBeenCalledTimes(1);
    });
    it('calls setValueIndices once', () => {
      expect((config as any).setValueIndices).toHaveBeenCalledTimes(1);
    });
  });

  describe('setDimensionPropertiesFromData()', () => {
    let numChartPositionSpy: jasmine.Spy;
    beforeEach(() => {
      spyOn(DotsConfig.prototype as any, 'initPropertiesFromData');
      numChartPositionSpy = spyOn(
        NumberChartPositionDimension.prototype as any,
        'setPropertiesFromData'
      );
      spyOn(
        NumberVisualValueDimension.prototype as any,
        'setPropertiesFromData'
      );
      spyOn(
        OrdinalVisualValueDimension.prototype as any,
        'setPropertiesFromData'
      );
      config = getNewConfig(testData);
      (config as any).setDimensionPropertiesFromData();
    });
    it('calls x.setPropertiesFromData and y.setPropertiesFromData once each', () => {
      expect(numChartPositionSpy.calls.allArgs()).toEqual([
        [testData],
        [testData],
      ]);
    });
    it('calls fill.setPropertiesFromData once', () => {
      expect(config.fill.setPropertiesFromData).toHaveBeenCalledOnceWith(
        testData
      );
    });
    it('calls radius.setPropertiesFromData once', () => {
      expect(config.radius.setPropertiesFromData).toHaveBeenCalledOnceWith(
        testData
      );
    });
  });

  describe('setValueIndices()', () => {
    beforeEach(() => {
      spyOn(DotsConfig.prototype as any, 'initPropertiesFromData');
    });
    it('returns the value indices of datums with unique ordinal values', () => {
      config = getNewConfig(testData);
      (config as any).setDimensionPropertiesFromData();
      (config as any).setValueIndices();
      expect(config.valueIndices).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
    it('sets valueIndices to the correct array when some values are not valid', () => {
      const problemData = [
        { rain: 50, snow: 2, state: 'AL', year: 2020 },
        { rain: 54, snow: 1, state: 'AL', year: 2021 },
        { rain: 66, snow: 82, state: 'AK', year: null },
        { rain: 'im a string' as any, snow: 53, state: 'AK', year: 2021 },
        { rain: 24, snow: 18, state: 'AZ', year: 2020 },
        { rain: 17, snow: 25, state: 'AZ', year: 2021 },
        { rain: 58, snow: 36, state: 'CA', year: 2020 },
        { rain: 66, snow: 50, state: 'CA', year: 2021 },
        { rain: 37, snow: 42, state: 'CO', year: 2020 },
        { rain: 49, snow: 63, state: 'CO', year: 2021 },
      ] as Datum[];
      config = getNewConfig(problemData);
      (config as any).setDimensionPropertiesFromData();
      (config as any).setValueIndices();
      expect(config.valueIndices).toEqual([0, 1, 4, 5, 6, 7, 8, 9]);
    });
  });
});

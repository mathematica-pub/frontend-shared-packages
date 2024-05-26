/* eslint-disable @typescript-eslint/no-explicit-any */
import { vicCategoricalDimension } from '../../data-dimensions/categorical-dimension';
import { vicDateDimension } from '../../data-dimensions/date-dimension';
import { vicQuantitativeDimension } from '../../data-dimensions/quantitative-dimension';
import { VicLinesConfig, vicLines } from './lines.config';

type Datum = { date: Date; value: number; category: string };
const data = [
  { date: new Date('2020-01-01'), value: 1, category: 'a' },
  { date: new Date('2020-01-02'), value: 2, category: 'a' },
  { date: new Date('2020-01-03'), value: 3, category: 'a' },
  { date: new Date('2020-01-01'), value: 4, category: 'b' },
  { date: new Date('2020-01-02'), value: 5, category: 'b' },
  { date: new Date('2020-01-03'), value: 6, category: 'b' },
];

function createConfig(): VicLinesConfig<Datum> {
  return vicLines({
    data,
    x: vicDateDimension<Datum>({
      valueAccessor: (d) => d.date,
    }),
    y: vicQuantitativeDimension<Datum>({
      valueAccessor: (d) => d.value,
    }),
    categorical: vicCategoricalDimension<Datum, string>({
      valueAccessor: (d) => d.category,
    }),
  });
}

describe('LinesConfig', () => {
  let config: VicLinesConfig<Datum>;
  beforeEach(() => {
    config = undefined;
  });

  describe('initPropertiesFromData()', () => {
    beforeEach(() => {
      spyOn(VicLinesConfig.prototype as any, 'setDimensionPropertiesFromData');
      spyOn(VicLinesConfig.prototype as any, 'setValueIndicies');
      spyOn(VicLinesConfig.prototype as any, 'setLinesD3Data');
      spyOn(VicLinesConfig.prototype as any, 'setLinesKeyFunction');
      spyOn(VicLinesConfig.prototype as any, 'setMarkersD3Data');
      spyOn(VicLinesConfig.prototype as any, 'setMarkersKeyFunction');
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
    it('calls setLinesD3Data once', () => {
      expect((config as any).setLinesD3Data).toHaveBeenCalledTimes(1);
    });
    it('calls setLinesKeyFunction once', () => {
      expect((config as any).setLinesKeyFunction).toHaveBeenCalledTimes(1);
    });
    it('calls setMarkersD3Data once', () => {
      expect((config as any).setMarkersD3Data).toHaveBeenCalledTimes(1);
    });
    it('calls setMarkersKeyFunction once', () => {
      expect((config as any).setMarkersKeyFunction).toHaveBeenCalledTimes(1);
    });
  });

  describe('canBeDrawnByPath()', () => {
    beforeEach(() => {
      spyOn(VicLinesConfig.prototype as any, 'initPropertiesFromData');
      config = createConfig();
    });
    it('integration: returns true if value is a number', () => {
      expect(config.canBeDrawnByPath(1)).toEqual(true);
    });
    it('integration: returns true if value is a Date', () => {
      expect(config.canBeDrawnByPath(new Date())).toEqual(true);
    });
    it('integration: returns false if value is undefined', () => {
      expect(config.canBeDrawnByPath(undefined)).toEqual(false);
    });
    it('integration: returns false if value is a string', () => {
      expect(config.canBeDrawnByPath('string')).toEqual(false);
    });
    it('integration: returns false if value is null', () => {
      expect(config.canBeDrawnByPath(null)).toEqual(false);
    });
    it('integration: returns false if value is an object', () => {
      expect(config.canBeDrawnByPath({ oops: 'not a num' })).toEqual(false);
    });
    it('integration: returns false if value is an array', () => {
      expect(config.canBeDrawnByPath(['not a num'])).toEqual(false);
    });
    it('integration: returns false if value is boolean', () => {
      expect(config.canBeDrawnByPath(true)).toEqual(false);
    });
  });
});

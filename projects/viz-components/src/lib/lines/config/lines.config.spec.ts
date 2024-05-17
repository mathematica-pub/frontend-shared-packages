import { vicCategoricalDimension } from '../../data-marks/dimensions/categorical-dimension';
import { vicDateDimension } from '../../data-marks/dimensions/date-dimension';
import { vicQuantitativeDimension } from '../../data-marks/dimensions/quantitative-dimension';
import { VicLinesConfig, vicLines } from './lines.config';

type Datum = { date: Date; value: number; category: string };

describe('LinesConfig', () => {
  let config: VicLinesConfig<Datum>;
  beforeEach(() => {
    config = vicLines({
      data: [
        { date: new Date('2020-01-01'), value: 1, category: 'a' },
        { date: new Date('2020-01-02'), value: 2, category: 'a' },
        { date: new Date('2020-01-03'), value: 3, category: 'a' },
        { date: new Date('2020-01-01'), value: 4, category: 'b' },
        { date: new Date('2020-01-02'), value: 5, category: 'b' },
        { date: new Date('2020-01-03'), value: 6, category: 'b' },
      ],
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
  });

  describe('setPropertiesFromData()', () => {
    beforeEach(() => {
      spyOn(config, 'setDimensionPropertiesFromData');
      spyOn(config, 'setValueIndicies');
      spyOn(config, 'setLinesD3Data');
      spyOn(config, 'setLinesKeyFunction');
      spyOn(config, 'setMarkersD3Data');
      spyOn(config, 'setMarkersKeyFunction');
      config.setPropertiesFromData();
    });
    it('calls setDimensionPropertiesFromData once', () => {
      expect(config.setDimensionPropertiesFromData).toHaveBeenCalledTimes(1);
    });
    it('calls setValueIndicies once', () => {
      expect(config.setValueIndicies).toHaveBeenCalledTimes(1);
    });
    it('calls setLinesD3Data once', () => {
      expect(config.setLinesD3Data).toHaveBeenCalledTimes(1);
    });
    it('calls setLinesKeyFunction once', () => {
      expect(config.setLinesKeyFunction).toHaveBeenCalledTimes(1);
    });
    it('calls setMarkersD3Data once', () => {
      expect(config.setMarkersD3Data).toHaveBeenCalledTimes(1);
    });
    it('calls setMarkersKeyFunction once', () => {
      expect(config.setMarkersKeyFunction).toHaveBeenCalledTimes(1);
    });
  });

  describe('canBeDrawnByPath()', () => {
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

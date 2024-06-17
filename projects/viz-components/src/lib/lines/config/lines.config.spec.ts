/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vic } from '../../config/vic';
import { VicLinesConfig } from './lines.config';

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
  return Vic.lines({
    data,
    x: Vic.dimensionQuantitativeDate<Datum>({
      valueAccessor: (d) => d.date,
    }),
    y: Vic.dimensionQuantitativeNumeric<Datum>({
      valueAccessor: (d) => d.value,
    }),
    categorical: Vic.dimensionCategorical<Datum, string>({
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
  });
});

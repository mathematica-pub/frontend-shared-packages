/* eslint-disable @typescript-eslint/no-explicit-any */
import { VicLinesConfigBuilder } from './lines-builder';
import { LinesConfig } from './lines-config';

type Datum = { date: Date; value: number; category: string };
const data = [
  { date: new Date('2020-01-01'), value: 1, category: 'a' },
  { date: new Date('2020-01-02'), value: 2, category: 'a' },
  { date: new Date('2020-01-03'), value: 3, category: 'a' },
  { date: new Date('2020-01-01'), value: 4, category: 'b' },
  { date: new Date('2020-01-02'), value: 5, category: 'b' },
  { date: new Date('2020-01-03'), value: 6, category: 'b' },
];

function createConfig(): LinesConfig<Datum> {
  return new VicLinesConfigBuilder<Datum>()
    .data(data)
    .createXDateDimension((dimension) => dimension.valueAccessor((d) => d.date))
    .createYDimension((dimension) => dimension.valueAccessor((d) => d.value))
    .createCategoricalDimension((dimension) =>
      dimension.valueAccessor((d) => d.category)
    )
    .build();
}

describe('LinesConfig', () => {
  let config: LinesConfig<Datum>;
  beforeEach(() => {
    config = undefined;
  });

  describe('initPropertiesFromData()', () => {
    beforeEach(() => {
      spyOn(LinesConfig.prototype as any, 'setDimensionPropertiesFromData');
      spyOn(LinesConfig.prototype as any, 'setValueIndices');
      spyOn(LinesConfig.prototype as any, 'setLinesD3Data');
      spyOn(LinesConfig.prototype as any, 'setLinesKeyFunction');
      config = createConfig();
    });
    it('calls setDimensionPropertiesFromData once', () => {
      expect(
        (config as any).setDimensionPropertiesFromData
      ).toHaveBeenCalledTimes(1);
    });
    it('calls setValueIndices once', () => {
      expect((config as any).setValueIndices).toHaveBeenCalledTimes(1);
    });
    it('calls setLinesD3Data once', () => {
      expect((config as any).setLinesD3Data).toHaveBeenCalledTimes(1);
    });
    it('calls setLinesKeyFunction once', () => {
      expect((config as any).setLinesKeyFunction).toHaveBeenCalledTimes(1);
    });
  });
});

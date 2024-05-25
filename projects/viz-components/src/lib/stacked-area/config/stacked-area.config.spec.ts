import { vicCategoricalDimension } from '../../data-dimensions/categorical-dimension';
import { vicDateDimension } from '../../data-dimensions/date-dimension';
import { vicQuantitativeDimension } from '../../data-dimensions/quantitative-dimension';
import { VicStackedAreaConfig, vicStackedArea } from './stacked-area.config';

type Datum = { date: Date; value: number; category: string };

describe('StackedAreaConfig', () => {
  let config: VicStackedAreaConfig<Datum, string>;
  beforeEach(() => {
    config = vicStackedArea({
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
      spyOn(config, 'setSeries');
      spyOn(config, 'initQuantitativeDomainFromStack');
      config.initPropertiesFromData();
    });
    it('calls setDimensionPropertiesFromData once', () => {
      expect(config.setDimensionPropertiesFromData).toHaveBeenCalledTimes(1);
    });
    it('calls setValueIndicies once', () => {
      expect(config.setValueIndicies).toHaveBeenCalledTimes(1);
    });
    it('calls setSeries once', () => {
      expect(config.setSeries).toHaveBeenCalledTimes(1);
    });
    it('calls initQuantitativeDomainFromStack once', () => {
      expect(config.initQuantitativeDomainFromStack).toHaveBeenCalledTimes(1);
    });
  });

  describe('setDimensionPropertiesFromData()', () => {
    beforeEach(() => {
      spyOn(config.x, 'setPropertiesFromData');
      spyOn(config.y, 'setPropertiesFromData');
      spyOn(config.categorical, 'setPropertiesFromData');
      config.setDimensionPropertiesFromData();
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
      config.x.values = [
        new Date('2020-01-01'),
        new Date('2020-01-02'),
        new Date('2020-01-03'),
      ];
      config.categorical.domain = ['a', 'b'];
      config.categorical.values = config.data.map(
        config.categorical.valueAccessor
      );
    });
    it('sets valueIndicies to an array of length 6', () => {
      config.setValueIndicies();
      expect(config.valueIndicies).toEqual([0, 1, 2]);
    });
  });
});

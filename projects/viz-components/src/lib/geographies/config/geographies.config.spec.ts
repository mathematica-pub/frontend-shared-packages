import { vicDataGeographies } from './dimensions/data-geographies';
import { vicEqualValuesAttributeDataDimension } from './dimensions/equal-value-ranges-bins';
import { VicGeographiesConfig } from './geographies.config';

type Datum = { value: number; state: string };

describe('GeographiesConifg', () => {
  let config: VicGeographiesConfig<Datum, { name: string }, any>;
  beforeEach(() => {
    config = new VicGeographiesConfig({
      data: [
        { value: 1, state: 'AL' },
        { value: 2, state: 'AK' },
        { value: 3, state: 'AZ' },
        { value: 4, state: 'CA' },
        { value: 5, state: 'CO' },
        { value: 6, state: 'CO' },
      ],
      dataGeographies: vicDataGeographies<Datum, { name: string }, any>({
        attributeData: vicEqualValuesAttributeDataDimension<Datum>({
          valueAccessor: (d) => d.value,
          geoAccessor: (d) => d.state,
          numBins: 5,
        }),
      }),
    });
  });

  describe('setPropertiesFromData()', () => {
    beforeEach(() => {
      spyOn(config, 'getUniqueDatumsByGeoAccessor').and.returnValue(
        config.data
      );
      spyOn(config, 'setAttributeData');
      spyOn(config.dataGeographies.attributeData, 'setPropertiesFromData');
      config.setPropertiesFromData();
    });
    it('calls getUniqueDatumsByGeoAccessor once', () => {
      expect(config.getUniqueDatumsByGeoAccessor).toHaveBeenCalledTimes(1);
    });
    it('calls dataGeographies.attributeData.setPropertiesFromData once', () => {
      expect(
        config.dataGeographies.attributeData.setPropertiesFromData
      ).toHaveBeenCalledOnceWith(config.data);
    });
    it('calls setAttributeData once', () => {
      expect(config.setAttributeData).toHaveBeenCalledOnceWith(config.data);
    });
  });

  describe('getUniqueDatumsByGeoAccessor()', () => {
    it('returns the unique datums by geoAccessor', () => {
      const result = config.getUniqueDatumsByGeoAccessor();
      expect(result).toEqual([
        { value: 1, state: 'AL' },
        { value: 2, state: 'AK' },
        { value: 3, state: 'AZ' },
        { value: 4, state: 'CA' },
        { value: 5, state: 'CO' },
      ]);
    });
  });
});

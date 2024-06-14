/* eslint-disable @typescript-eslint/no-explicit-any */

import { Vic } from '../../config/vic';
import { VicEqualValuesAttributeDataDimension } from './dimensions/equal-value-ranges-bins';
import { VicGeographiesConfig } from './geographies.config';

type Datum = { value: number; state: string };
type FeatureProperties = { name: string };
const data = [
  { value: 1, state: 'AL' },
  { value: 2, state: 'AK' },
  { value: 3, state: 'AZ' },
  { value: 4, state: 'CA' },
  { value: 5, state: 'CO' },
  { value: 6, state: 'CO' },
];
const features = [
  { name: 'Alabama' },
  { name: 'Alaska' },
  { name: 'Arizona' },
  { name: 'California' },
  { name: 'Colorado' },
];
function createConfig(): VicGeographiesConfig<Datum, { name: string }, any> {
  return Vic.geographies({
    data: data,
    dataLayer: Vic.geographiesDataLayer<Datum, { name: string }, any>({
      attributeData: Vic.geographiesDataDimensionEqualValueRanges<Datum>({
        valueAccessor: (d) => d.value,
        geoAccessor: (d) => d.state,
        numBins: 5,
      }),
    }),
    noDataLayers: [
      Vic.geographiesNoDataLayer<FeatureProperties>({
        geographies: features as any,
        categorical: Vic.dimensionCategorical({
          range: ['lime'],
        }),
      }),
    ],
  });
}

describe('GeographiesConfig', () => {
  let config: VicGeographiesConfig<Datum, { name: string }, any>;

  beforeEach(() => {
    config = undefined;
  });

  describe('initPropertiesFromData()', () => {
    beforeEach(() => {
      spyOn(
        VicGeographiesConfig.prototype as any,
        'getUniqueDatumsByGeoAccessor'
      ).and.returnValue(data);
      spyOn(VicGeographiesConfig.prototype as any, 'setAttributeData');
      spyOn(
        VicEqualValuesAttributeDataDimension.prototype as any,
        'setPropertiesFromData'
      );
      config = createConfig();
    });
    it('calls getUniqueDatumsByGeoAccessor once', () => {
      expect(
        (config as any).getUniqueDatumsByGeoAccessor
      ).toHaveBeenCalledTimes(1);
    });
    it('calls dataGeographies.attributeData.setPropertiesFromData once', () => {
      expect(
        config.dataLayer.attributeData.setPropertiesFromData
      ).toHaveBeenCalledOnceWith(data);
    });
    it('calls setAttributeData once', () => {
      expect((config as any).setAttributeData).toHaveBeenCalledOnceWith(data);
    });
  });

  describe('getUniqueDatumsByGeoAccessor()', () => {
    beforeEach(() => {
      spyOn(VicGeographiesConfig.prototype as any, 'initPropertiesFromData');
      config = createConfig();
    });
    it('returns the unique datums by geoAccessor', () => {
      const result = (config as any).getUniqueDatumsByGeoAccessor();
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

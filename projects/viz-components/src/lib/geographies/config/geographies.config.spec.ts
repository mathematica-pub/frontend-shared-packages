/* eslint-disable @typescript-eslint/no-explicit-any */

import { Vic } from '../../config/vic';
import { VicGeographiesConfig } from './geographies.config';
import { VicGeographiesAttributeDataLayer } from './layers/data-layer';
import { GeographiesLayer } from './layers/geographies-layer';

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
    attributeDataLayer: Vic.geographiesDataLayer<Datum, { name: string }, any>({
      attributeDimension: Vic.geographiesDataDimensionEqualValueRanges<Datum>({
        valueAccessor: (d) => d.value,
        numBins: 5,
      }),
      geographyIndexAccessor: (d) => d.state,
      data,
    }),
    geojsonPropertiesLayers: [
      Vic.geographiesNonAttributeDataLayer<FeatureProperties>({
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

  describe('init()', () => {
    beforeEach(() => {
      spyOn(
        VicGeographiesAttributeDataLayer.prototype as any,
        'initPropertiesFromData'
      );
      spyOn(VicGeographiesConfig.prototype as any, 'setLayers');
      spyOn(
        VicGeographiesConfig.prototype as any,
        'setLayerFeatureIndexAccessors'
      );
      config = createConfig();
    });
    it('calls initPropertiesFromData once', () => {
      expect(
        (config as any).attributeDataLayer.initPropertiesFromData
      ).toHaveBeenCalledTimes(1);
    });
    it('calls setLayers once', () => {
      expect((config as any).setLayers).toHaveBeenCalledTimes(1);
    });
    it('calls setLayerFeatureIndexAccessors once', () => {
      expect(
        (config as any).setLayerFeatureIndexAccessors
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('setLayers()', () => {
    beforeEach(() => {
      config = createConfig();
    });
    it('sets layers to an array with attributeDataLayer and geojsonPropertiesLayers', () => {
      expect(config.layers.length).toBe(2);
    });
  });

  describe('setLayerFeatureIndexAccessors()', () => {
    let featureAccessorSpy: jasmine.Spy;
    beforeEach(() => {
      featureAccessorSpy = spyOn(
        GeographiesLayer.prototype as any,
        'setFeatureIndexAccessor'
      );
      config = createConfig();
    });
    it('calls setFeatureValueAccessor once per layer', () => {
      expect(featureAccessorSpy).toHaveBeenCalledTimes(2);
    });
  });
});

/* eslint-disable @typescript-eslint/no-explicit-any */
import { VicGeographiesConfigBuilder } from './geographies-builder';
import { GeographiesConfig } from './geographies-config';
import { GeographiesAttributeDataLayer } from './layers/attribute-data-layer/attribute-data-layer';
import { GeographiesLayer } from './layers/geographies-layer/geographies-layer';

type Datum = { value: number; state: string };
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
function createConfig(): GeographiesConfig<Datum, { name: string }, any> {
  return new VicGeographiesConfigBuilder<Datum, { name: string }>()
    .boundary('boundary' as any)
    .featureIndexAccessor((d) => d.properties.name)
    .attributeDataLayer((layer) =>
      layer
        .equalValueRangesBins((dimension) =>
          dimension.valueAccessor((d) => d.value).numBins(5)
        )
        .geographyIndexAccessor((d) => d.state)
        .data(data)
    )
    .geojsonPropertiesLayer((layer) =>
      layer
        .geographies(features as any)
        .fill((dimension) => dimension.range(['lime']))
    )
    .getConfig();
}

describe('GeographiesConfig', () => {
  let config: GeographiesConfig<Datum, { name: string }, any>;

  beforeEach(() => {
    config = undefined;
  });

  describe('init()', () => {
    beforeEach(() => {
      spyOn(
        GeographiesAttributeDataLayer.prototype as any,
        'initPropertiesFromData'
      );
      spyOn(GeographiesConfig.prototype as any, 'setLayers');
      spyOn(
        GeographiesConfig.prototype as any,
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

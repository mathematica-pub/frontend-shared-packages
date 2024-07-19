/* eslint-disable @typescript-eslint/no-explicit-any */
import { VicDimensionCategorical } from '../../../../data-dimensions/categorical/categorical';
import { VicGeographiesGeojsonPropertiesLayer } from './geojson-properties-layer';
import { VicGeographiesGeojsonPropertiesLayerBuilder } from './geojson-properties-layer-builder';

type FeatureProperties = { name: string };
const features = [
  { name: 'Alabama' },
  { name: 'Alaska' },
  { name: 'Arizona' },
  { name: 'California' },
  { name: 'Colorado' },
];
function createLayer(): VicGeographiesGeojsonPropertiesLayer<
  { name: string },
  any
> {
  return new VicGeographiesGeojsonPropertiesLayerBuilder<FeatureProperties>()
    .geographies(features as any)
    .createCategoricalDimension((dimension) => dimension.range(['lime']))
    .build();
}

describe('GeographiesGeojsonPropertiesLayer', () => {
  let layer: VicGeographiesGeojsonPropertiesLayer<{ name: string }, any>;

  beforeEach(() => {
    layer = undefined;
  });

  describe('initPropertiesFromGeographies()', () => {
    beforeEach(() => {
      spyOn(VicDimensionCategorical.prototype as any, 'setPropertiesFromData');
      layer = createLayer();
    });
    it('calls setPropertiesFromData once if categorical dimension exists', () => {
      expect(
        (layer as any).categorical.setPropertiesFromData
      ).toHaveBeenCalledOnceWith(features);
    });
  });
});

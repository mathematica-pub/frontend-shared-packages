/* eslint-disable @typescript-eslint/no-explicit-any */
import { CategoricalDimension } from '../../../../data-dimensions/categorical/categorical';
import { GeographiesGeojsonPropertiesLayer } from './geojson-properties-layer';
import { GeographiesGeojsonPropertiesLayerBuilder } from './geojson-properties-layer-builder';

type FeatureProperties = { name: string };
const features = [
  { name: 'Alabama' },
  { name: 'Alaska' },
  { name: 'Arizona' },
  { name: 'California' },
  { name: 'Colorado' },
];
function createLayer(): GeographiesGeojsonPropertiesLayer<
  { name: string },
  any
> {
  return new GeographiesGeojsonPropertiesLayerBuilder<FeatureProperties>()
    .geographies(features as any)
    .createCategoricalDimension((dimension) => dimension.range(['lime']))
    ._build();
}

describe('GeographiesGeojsonPropertiesLayer', () => {
  let layer: GeographiesGeojsonPropertiesLayer<{ name: string }, any>;

  beforeEach(() => {
    layer = undefined;
  });

  describe('initPropertiesFromGeographies()', () => {
    beforeEach(() => {
      spyOn(CategoricalDimension.prototype as any, 'setPropertiesFromData');
      layer = createLayer();
    });
    it('calls setPropertiesFromData once if categorical dimension exists', () => {
      expect(
        (layer as any).categorical.setPropertiesFromData
      ).toHaveBeenCalledOnceWith(features);
    });
  });
});

/* eslint-disable @typescript-eslint/no-explicit-any */
import { OrdinalVisualValueDimension } from '../../../../data-dimensions/ordinal/ordinal-visual-value/ordinal-visual-value';
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
    .fillCategorical((dimension) => dimension.range(['lime']))
    ._build();
}

describe('GeographiesGeojsonPropertiesLayer', () => {
  let layer: GeographiesGeojsonPropertiesLayer<{ name: string }, any>;

  describe('initPropertiesFromGeographies()', () => {
    beforeEach(() => {
      spyOn(
        OrdinalVisualValueDimension.prototype as any,
        'setPropertiesFromData'
      );
      layer = createLayer();
    });
    it('calls setPropertiesFromData once if categorical dimension exists', () => {
      expect(
        (layer as any).categorical.setPropertiesFromData
      ).toHaveBeenCalledOnceWith(features);
    });
  });
});

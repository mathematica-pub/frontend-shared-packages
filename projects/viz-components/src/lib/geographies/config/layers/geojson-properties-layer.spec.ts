/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vic } from '../../../config/vic';
import { VicDimensionCategorical } from '../../../data-dimensions/categorical/categorical';
import { VicGeographiesGeojsonPropertiesLayer } from './geojson-properties-layer';

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
  return Vic.geographiesNonAttributeDataLayer<FeatureProperties>({
    geographies: features as any,
    categorical: Vic.dimensionCategorical({
      range: ['lime'],
    }),
  });
}

describe('GeographiesNoDataLayer', () => {
  let layer: VicGeographiesGeojsonPropertiesLayer<{ name: string }, any>;

  beforeEach(() => {
    layer = undefined;
  });

  describe('initPropertiesFromGeographies()', () => {
    beforeEach(() => {
      spyOn(VicDimensionCategorical.prototype as any, 'setPropertiesFromData');
      spyOn(VicDimensionCategorical.prototype as any, 'getScale');
      layer = createLayer();
    });
    it('calls setPropertiesFromData once if categorical dimension exists', () => {
      expect(
        (layer as any).categorical.setPropertiesFromData
      ).toHaveBeenCalledOnceWith(features);
    });
    it('calls getScale once if categorical dimension exists', () => {
      expect((layer as any).categorical.getScale).toHaveBeenCalledTimes(1);
    });
  });
});

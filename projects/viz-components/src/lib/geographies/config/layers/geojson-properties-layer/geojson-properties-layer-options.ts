import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { CategoricalDimension } from '../../../../data-dimensions/categorical/categorical';
import { GeographiesFeature } from '../../../geographies-feature';
import { GeographiesLayerOptions } from '../geographies-layer/geographies-layer-options';

export interface GeographiesGeojsonPropertiesLayerOptions<
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon,
> extends GeographiesLayerOptions<TProperties, TGeometry> {
  categorical: CategoricalDimension<
    GeographiesFeature<TProperties, TGeometry>,
    string
  >;
  fill: string;
}

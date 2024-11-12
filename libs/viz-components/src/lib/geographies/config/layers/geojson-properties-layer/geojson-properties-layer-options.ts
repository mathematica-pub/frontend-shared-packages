import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { OrdinalVisualValueDimension } from '../../../../data-dimensions/ordinal/ordinal-visual-value/ordinal-visual-value';
import { GeographiesFeature } from '../../../geographies-feature';
import { GeographiesLayerOptions } from '../geographies-layer/geographies-layer-options';

export interface GeographiesGeojsonPropertiesLayerOptions<
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon,
> extends GeographiesLayerOptions<TProperties, TGeometry> {
  categorical: OrdinalVisualValueDimension<
    GeographiesFeature<TProperties, TGeometry>,
    string
  >;
  fill: string;
}

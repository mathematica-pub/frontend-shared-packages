import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { OrdinalVisualValueDimension } from '../../../../data-dimensions/ordinal/ordinal-visual-value/ordinal-visual-value';
import { FillDefinition } from '../../../../fill-definitions/fill-definitions';
import { GeographiesFeature } from '../../../geographies-feature';
import { GeographiesLayerOptions } from '../geographies-layer/geographies-layer-options';

export interface GeographiesGeojsonPropertiesLayerOptions<
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon,
> extends GeographiesLayerOptions<TProperties, TGeometry> {
  customFills: FillDefinition<GeographiesFeature<TProperties, TGeometry>>[];
  fill: OrdinalVisualValueDimension<
    GeographiesFeature<TProperties, TGeometry>,
    string,
    string
  >;
  marksClass: string;
  mixBlendMode: string;
}

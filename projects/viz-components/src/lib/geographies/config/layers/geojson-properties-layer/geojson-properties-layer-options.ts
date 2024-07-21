import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { CategoricalDimension } from 'projects/viz-components/src/lib/data-dimensions/categorical/categorical';
import { VicGeographiesFeature } from '../../../geographies-feature';
import { GeographiesLayerOptions } from '../geographies-layer/geographies-layer-options';
import { GeographiesLabels } from '../labels/geographies-labels';

export interface GeographiesGeojsonPropertiesLayerOptions<
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon
> extends GeographiesLayerOptions<TProperties, TGeometry> {
  categorical: CategoricalDimension<
    VicGeographiesFeature<TProperties, TGeometry>,
    string
  >;
  fill: string;
  labels: GeographiesLabels<string, TProperties, TGeometry>;
}

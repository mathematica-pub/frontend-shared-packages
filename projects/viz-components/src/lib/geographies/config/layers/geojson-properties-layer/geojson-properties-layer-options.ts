import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { VicDimensionCategorical } from 'projects/viz-components/src/lib/data-dimensions/categorical/categorical';
import { VicGeographiesFeature } from '../../../geographies-feature';
import { GeographiesLayerOptions } from '../geographies-layer/geographies-layer-options';
import { VicGeographiesLabels } from '../labels/geographies-labels';

export interface VicGeographiesGeojsonPropertiesLayerOptions<
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon
> extends GeographiesLayerOptions<TProperties, TGeometry> {
  categorical: VicDimensionCategorical<
    VicGeographiesFeature<TProperties, TGeometry>,
    string
  >;
  fill: string;
  labels: VicGeographiesLabels<string, TProperties, TGeometry>;
}

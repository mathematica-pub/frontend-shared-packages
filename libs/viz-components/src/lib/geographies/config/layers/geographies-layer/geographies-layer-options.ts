import { Geometry } from 'geojson';
import { Stroke } from '../../../../stroke/stroke';
import { GeographiesFeature } from '../../../geographies-feature';
import { GeographiesLabels } from '../labels/geographies-labels';

/**
 * Base configuration object for geographies that can be used with or without attribute data.
 *
 * The generic parameters are the same as those in VicGeographiesConfig.
 */
export interface GeographiesLayerOptions<
  TProperties,
  TGeometry extends Geometry,
> {
  class: string;
  enableEventActions: boolean;
  labels: GeographiesLabels<TProperties, TGeometry>;
  geographies: Array<GeographiesFeature<TProperties, TGeometry>>;
  stroke: Stroke;
}

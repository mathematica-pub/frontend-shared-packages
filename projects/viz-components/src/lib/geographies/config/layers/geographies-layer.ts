import { Geometry } from 'geojson';
import { VicGeographiesFeature } from '../../geographies-feature';
import { VicGeographiesLabels } from '../geographies-labels';

/**
 * Base configuration object for geographies that can be used with or without attribute data.
 *
 * The generic parameters are the same as those in VicGeographiesConfig.
 */
export interface VicGeographiesLayerOptions<
  TProperties,
  TGeometry extends Geometry
> {
  /**
   * The class to be applied to the geography layer.
   */
  class: string;
  /**
   * GeoJSON features that define the geographies to be drawn.
   */
  geographies: Array<VicGeographiesFeature<TProperties, TGeometry>>;
  /**
   * The color of the stroke for the geography.
   * @default: 'dimgray'.
   */
  strokeColor: string;
  /**
   * The width of the stroke for the geography.
   * @default: 1.
   */
  strokeWidth: string;
}

export class VicGeographiesLayer<Datum, TProperties, TGeometry extends Geometry>
  implements VicGeographiesLayerOptions<TProperties, TGeometry>
{
  hasAttributeData: boolean;
  geographies: Array<VicGeographiesFeature<TProperties, TGeometry>>;
  labels: VicGeographiesLabels<Datum, TProperties, TGeometry>;
  class: string;
  strokeColor: string;
  strokeWidth: string;
}

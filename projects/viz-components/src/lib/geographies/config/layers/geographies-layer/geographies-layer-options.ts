import { Geometry } from 'geojson';
import { VicGeographiesFeature } from '../../../geographies-feature';

/**
 * Base configuration object for geographies that can be used with or without attribute data.
 *
 * The generic parameters are the same as those in VicGeographiesConfig.
 */
export interface GeographiesLayerOptions<
  TProperties,
  TGeometry extends Geometry
> {
  /**
   * The class to be applied to the geography layer.
   */
  class: string;
  /**
   * Whether the layer can use viz-components pointer effects. If true, the event listener that corresponds to the provided directive will be placed on that layer's paths.
   */
  enableEffects: boolean;
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

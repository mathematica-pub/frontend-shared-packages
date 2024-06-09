import { Geometry } from 'geojson';
import { VicGeographiesFeature } from '../../geographies-feature';
import { VicGeographiesLabels } from '../geographies-labels';

/**
 * Base configuration object for geographies that can be used with or without attribute data.
 *
 * The generic parameters are the same as those in VicGeographiesConfig.
 */
export interface VicBaseDataGeographyOptions<
  Datum,
  TProperties,
  TGeometry extends Geometry
> {
  /**
   * VicGeographyLabelConfig that define the labels to be shown.
   * If not defined, no labels will be drawn.
   */
  labels: VicGeographiesLabels<Datum, TProperties, TGeometry>;
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

export class VicBaseDataGeographyConfig<
  Datum,
  TProperties,
  TGeometry extends Geometry
> {
  geographies: Array<VicGeographiesFeature<TProperties, TGeometry>>;
  labels: VicGeographiesLabels<Datum, TProperties, TGeometry>;
  strokeColor: string;
  strokeWidth: string;
}

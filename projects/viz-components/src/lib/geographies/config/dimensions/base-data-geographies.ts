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
   * GeoJSON features that define the geographies to be drawn.
   */
  geographies: Array<VicGeographiesFeature<TProperties, TGeometry>>;
  /**
   * The fill color for the geography.
   * @default: 'none'.
   */
  fill: string;
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
  /**
   * VicGeographyLabelConfig that define the labels to be shown.
   * If not defined, no labels will be drawn.
   */
  labels: VicGeographiesLabels<Datum, TProperties, TGeometry>;
}

export class VicBaseDataGeographyConfig<
  Datum,
  TProperties,
  TGeometry extends Geometry
> {
  geographies: Array<VicGeographiesFeature<TProperties, TGeometry>>;
  fill: string;
  strokeColor: string;
  strokeWidth: string;
  labels: VicGeographiesLabels<Datum, TProperties, TGeometry>;
}

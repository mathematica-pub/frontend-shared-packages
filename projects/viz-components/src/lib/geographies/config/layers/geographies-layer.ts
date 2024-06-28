import * as CSSType from 'csstype';
import { Geometry } from 'geojson';
import { VicGeographiesFeature } from '../../geographies-feature';
import { VicGeographiesTooltipOutput } from '../../geographies-tooltip-data';
import { VicGeographiesLabels } from './geographies-labels';

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

export abstract class GeographiesLayer<
  Datum,
  TProperties,
  TGeometry extends Geometry
> implements GeographiesLayerOptions<TProperties, TGeometry>
{
  class: string;
  enableEffects: boolean;
  featureIndexAccessor: (
    d: VicGeographiesFeature<TProperties, TGeometry>
  ) => string;
  geographies: Array<VicGeographiesFeature<TProperties, TGeometry>>;
  id: number;
  labels: VicGeographiesLabels<Datum, TProperties, TGeometry>;
  strokeColor: string;
  strokeWidth: string;

  setFeatureIndexAccessor(
    accessor: (d: VicGeographiesFeature<TProperties, TGeometry>) => string
  ): void {
    this.featureIndexAccessor = accessor;
  }

  abstract getFill(
    feature: VicGeographiesFeature<TProperties, TGeometry>
  ): string;

  abstract getLabelColor(
    feature: VicGeographiesFeature<TProperties, TGeometry>
  ): CSSType.Property.Fill;

  abstract getLabelFontWeight(
    feature: VicGeographiesFeature<TProperties, TGeometry>
  ): CSSType.Property.FontWeight;

  abstract getTooltipData(
    path: SVGPathElement
  ): VicGeographiesTooltipOutput<Datum | undefined>;
}

import * as CSSType from 'csstype';
import { Geometry } from 'geojson';
import { VicGeographiesFeature } from '../../../geographies-feature';
import { VicGeographiesTooltipOutput } from '../../../geographies-tooltip-data';
import { GeographiesLabels } from '../labels/geographies-labels';
import { GeographiesLayerOptions } from './geographies-layer-options';

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
  labels: GeographiesLabels<Datum, TProperties, TGeometry>;
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

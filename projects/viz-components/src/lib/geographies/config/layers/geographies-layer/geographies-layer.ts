import * as CSSType from 'csstype';
import { Geometry } from 'geojson';
import { GeographiesTooltipData } from '../../../events/geographies-event-output';
import { GeographiesFeature } from '../../../geographies-feature';
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
    d: GeographiesFeature<TProperties, TGeometry>
  ) => string;
  geographies: Array<GeographiesFeature<TProperties, TGeometry>>;
  id: number;
  labels: GeographiesLabels<Datum, TProperties, TGeometry>;
  strokeColor: string;
  strokeWidth: string;

  setFeatureIndexAccessor(
    accessor: (d: GeographiesFeature<TProperties, TGeometry>) => string
  ): void {
    this.featureIndexAccessor = accessor;
  }

  abstract getFill(feature: GeographiesFeature<TProperties, TGeometry>): string;

  abstract getLabelColor(
    feature: GeographiesFeature<TProperties, TGeometry>
  ): CSSType.Property.Fill;

  abstract getLabelFontWeight(
    feature: GeographiesFeature<TProperties, TGeometry>
  ): CSSType.Property.FontWeight;

  abstract getTooltipData(
    path: SVGPathElement
  ): GeographiesTooltipData<Datum | undefined>;
}

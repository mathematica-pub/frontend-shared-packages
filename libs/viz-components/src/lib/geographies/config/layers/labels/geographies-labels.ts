import type * as CSSType from 'csstype';
import { GeoPath, GeoProjection, ScaleLinear } from 'd3';
import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { Position } from '../../../../core/types/layout';
import { GeographiesFeature } from '../../../geographies-feature';
import {
  GeographiesLabelsColorOptions,
  GeographiesLabelsFontWeightOptions,
  GeographiesLabelsOptions,
} from './geographies-labels-options';

export class GeographiesLabels<
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon,
> implements GeographiesLabelsOptions<TProperties, TGeometry>
{
  alignmentBaseline: CSSType.Property.AlignmentBaseline;
  color: GeographiesLabelsColorOptions | CSSType.Property.Fill;
  cursor: CSSType.Property.Cursor;
  display: (featureIndex: string) => boolean;
  dominantBaseline: CSSType.Property.DominantBaseline;
  fontScale: ScaleLinear<number, number, never>;
  fontWeight: GeographiesLabelsFontWeightOptions | CSSType.Property.FontWeight;
  pointerEvents: CSSType.Property.PointerEvents;
  position: (
    d: GeographiesFeature<TProperties, TGeometry>,
    path: GeoPath,
    projection?: GeoProjection
  ) => Position;
  textAnchor: CSSType.Property.TextAnchor;
  valueAccessor: (
    feature: GeographiesFeature<TProperties, TGeometry>
  ) => string;

  constructor(options: GeographiesLabelsOptions<TProperties, TGeometry>) {
    Object.assign(this, options);
  }
}

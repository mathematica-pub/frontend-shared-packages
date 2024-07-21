import type * as CSSType from 'csstype';
import { GeoPath, GeoProjection, ScaleLinear } from 'd3';
import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { Position } from '../../../../core/types/layout';
import { GeographiesFeature } from '../../../geographies-feature';

/**
 * Configuration object for displaying labels on map.
 *
 * The generic parameters are the same as those in VicGeographiesConfig.
 */
export interface GeographiesLabelsOptions<
  Datum,
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon
> {
  alignmentBaseline: CSSType.Property.AlignmentBaseline;
  color:
    | ((
        d: Datum,
        backgroundColor: CSSType.Property.Fill
      ) => CSSType.Property.Fill)
    | CSSType.Property.Fill;
  cursor: CSSType.Property.Cursor;
  display: (featureIndex: string) => boolean;
  dominantBaseline: CSSType.Property.DominantBaseline;
  fontScale: ScaleLinear<number, number, never>;
  fontWeight:
    | ((
        d: Datum,
        backgroundColor: CSSType.Property.Fill
      ) => CSSType.Property.FontWeight)
    | CSSType.Property.FontWeight;
  pointerEvents: CSSType.Property.PointerEvents;
  position: (
    d: GeographiesFeature<TProperties, TGeometry>,
    path: GeoPath,
    projection: GeoProjection
  ) => Position;
  textAnchor: CSSType.Property.TextAnchor;
  valueAccessor: (
    feature: GeographiesFeature<TProperties, TGeometry>
  ) => string;
}

import type * as CSSType from 'csstype';
import { GeoPath, GeoProjection, ScaleLinear } from 'd3';
import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { VicPosition } from '../../../../core/types/layout';
import { VicGeographiesFeature } from '../../../geographies-feature';

/**
 * Configuration object for displaying labels on map.
 *
 * The generic parameters are the same as those in VicGeographiesConfig.
 */
export interface VicGeographiesLabelsOptions<
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
    d: VicGeographiesFeature<TProperties, TGeometry>,
    path: GeoPath,
    projection: GeoProjection
  ) => VicPosition;
  textAnchor: CSSType.Property.TextAnchor;
  valueAccessor: (
    feature: VicGeographiesFeature<TProperties, TGeometry>
  ) => string;
}

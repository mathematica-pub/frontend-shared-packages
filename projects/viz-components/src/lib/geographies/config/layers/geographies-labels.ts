import type * as CSSType from 'csstype';
import { GeoPath, GeoProjection, ScaleLinear, scaleLinear } from 'd3';
import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { VicPosition } from '../../../core/types/layout';
import { VicGeographiesFeature } from '../../geographies-feature';
import { VicGeographiesLabelsPositioners } from './geographies-labels-positioners';

const DEFAULT = {
  display: () => true,
  valueAccessor: (feature) => feature,
  color: '#000',
  fontWeight: 400,
  fontScale: scaleLinear().domain([0, 800]).range([0, 17]),
  textAnchor: 'middle',
  alignmentBaseline: 'middle',
  dominantBaseline: 'middle',
  cursor: 'default',
  pointerEvents: 'none',
};

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
  /**
   * Function that determines whether a label should be shown on the GeoJSON feature
   *
   * Example use case: Don't show labels for very small states.
   */
  display: (featureIndex: string) => boolean;
  valueAccessor: (
    feature: VicGeographiesFeature<TProperties, TGeometry>
  ) => string;
  textAnchor: CSSType.Property.TextAnchor;
  alignmentBaseline: CSSType.Property.AlignmentBaseline;
  dominantBaseline: CSSType.Property.DominantBaseline;
  cursor: CSSType.Property.Cursor;
  pointerEvents: CSSType.Property.PointerEvents;
  fontWeight:
    | ((
        d: Datum,
        backgroundColor: CSSType.Property.Fill
      ) => CSSType.Property.FontWeight)
    | CSSType.Property.FontWeight;
  color:
    | ((
        d: Datum,
        backgroundColor: CSSType.Property.Fill
      ) => CSSType.Property.Fill)
    | CSSType.Property.Fill;
  position: (
    d: VicGeographiesFeature<TProperties, TGeometry>,
    path: GeoPath,
    projection: GeoProjection
  ) => VicPosition;
  fontScale: ScaleLinear<number, number, never>;
}

export class VicGeographiesLabels<
  Datum,
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon
> implements VicGeographiesLabelsOptions<Datum, TProperties, TGeometry>
{
  display: (featureIndex: string) => boolean;
  valueAccessor: (
    featureIndex: VicGeographiesFeature<TProperties, TGeometry>
  ) => string;
  textAnchor: CSSType.Property.TextAnchor;
  alignmentBaseline: CSSType.Property.AlignmentBaseline;
  dominantBaseline: CSSType.Property.DominantBaseline;
  cursor: CSSType.Property.Cursor;
  pointerEvents: CSSType.Property.PointerEvents;
  fontWeight:
    | ((
        d: Datum,
        backgroundColor: CSSType.Property.Fill
      ) => CSSType.Property.FontWeight)
    | CSSType.Property.FontWeight;
  color:
    | ((
        d: Datum,
        backgroundColor: CSSType.Property.Fill
      ) => CSSType.Property.Fill)
    | CSSType.Property.Fill;
  position: (
    d: VicGeographiesFeature<TProperties, TGeometry>,
    path: GeoPath,
    projection: GeoProjection
  ) => VicPosition;
  fontScale: ScaleLinear<number, number, never>;

  constructor(
    options: Partial<VicGeographiesLabelsOptions<Datum, TProperties, TGeometry>>
  ) {
    this.position = (d, path) =>
      VicGeographiesLabelsPositioners.positionAtCentroid<
        TProperties,
        TGeometry
      >(d, path);
    Object.assign(this, DEFAULT);
    Object.assign(this, options);
  }
}

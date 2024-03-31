import type * as CSSType from 'csstype';
import { GeoPath, GeoProjection, ScaleLinear, scaleLinear } from 'd3';
import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { VicPosition } from '../core/types/layout';
import { VicGeographiesFeature } from './geographies';
import { VicGeographiesLabelsPositioners } from './geographies-labels-positioners';

/**
 * Configuration object for displaying labels on map.
 *
 * The generic parameters are the same as those in VicGeographiesConfig.
 */
export class VicGeographyLabelConfig<
  Datum,
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon
> {
  /**
   * Function that determines whether a label should be shown on the GeoJSON feature
   *
   * Example use case: Don't show labels for very small states.
   */
  display: (
    d: VicGeographiesFeature<TProperties, TGeometry>,
    ...args: any
  ) => boolean;
  /**
   * Function that maps a geojson feature to the desired label.
   */
  valueAccessor: (d: VicGeographiesFeature<TProperties, TGeometry>) => string;
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
    init?: Partial<VicGeographyLabelConfig<Datum, TProperties, TGeometry>>
  ) {
    this.display = () => true;
    this.color = '#000';
    this.fontWeight = 400;
    this.position = (d, path) =>
      VicGeographiesLabelsPositioners.positionAtCentroid<
        TProperties,
        TGeometry
      >(d, path);
    this.fontScale = scaleLinear().domain([0, 800]).range([0, 17]);
    this.textAnchor = 'middle';
    this.alignmentBaseline = 'middle';
    this.dominantBaseline = 'middle';
    this.cursor = 'default';
    this.pointerEvents = 'none';
    Object.assign(this, init);
  }
}

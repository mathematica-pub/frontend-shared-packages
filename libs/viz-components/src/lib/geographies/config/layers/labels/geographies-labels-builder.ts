import type * as CSSType from 'csstype';
import {
  GeoPath,
  GeoProjection,
  maxIndex,
  polygonArea,
  scaleLinear,
  ScaleLinear,
} from 'd3';
import { Geometry, MultiPolygon, Polygon } from 'geojson';
import polylabel from 'polylabel';
import { Position } from '../../../../core/types/layout';
import { GeographiesFeature } from '../../../geographies-feature';
import { GeographiesLabels } from './geographies-labels';
import {
  GeographiesLabelsColorOptions,
  GeographiesLabelsFontWeightOptions,
} from './geographies-labels-options';

const DEFAULT = {
  _alignmentBaseline: 'middle',
  _color: '#000',
  _cursor: 'default',
  _display: () => true,
  _dominantBaseline: 'middle',
  _fontScale: scaleLinear().domain([0, 800]).range([0, 17]),
  _fontWeight: 400,
  _textAnchor: 'middle',
  _pointerEvents: 'none',
  _valueAccessor: (feature) => feature,
};

export class GeographiesLabelsBuilder<
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon,
> {
  private _alignmentBaseline: CSSType.Property.AlignmentBaseline;
  private _color: GeographiesLabelsColorOptions | CSSType.Property.Fill;
  private _cursor: CSSType.Property.Cursor;
  private _display: (featureIndex: string) => boolean;
  private _dominantBaseline: CSSType.Property.DominantBaseline;
  private _fontWeight:
    | GeographiesLabelsFontWeightOptions
    | CSSType.Property.FontWeight;
  private _fontScale: ScaleLinear<number, number, never>;
  private _pointerEvents: CSSType.Property.PointerEvents;
  private _position: (
    d: GeographiesFeature<TProperties, TGeometry>,
    path: GeoPath,
    projection?: GeoProjection
  ) => Position;
  private _textAnchor: CSSType.Property.TextAnchor;
  private _valueAccessor: (
    featureIndex: GeographiesFeature<TProperties, TGeometry>
  ) => string;

  constructor() {
    Object.assign(this, DEFAULT);
    this._position = (d, path) =>
      this.positionAtCentroid<TProperties, TGeometry>(d, path);
  }

  /**
   * OPTIONAL. The alignment of the baseline of the text relative to the text's font.
   *
   * @default 'middle'
   */
  alignmentBaseline(
    alignmentBaseline: CSSType.Property.AlignmentBaseline
  ): this {
    this._alignmentBaseline = alignmentBaseline;
    return this;
  }

  /**
   * OPTIONAL. The color of the text. If a string value is provided, that value will be used for all geographies on the layer.
   *
   * If an object is provided, the color between default and contrastAlternative that has the highest contrast ratio with the geography's background color will be used.
   *
   * If a value for `pattern` is provided, that value will be used for geographies with a fill pattern. If it is not provided, the default option will be used for geographies with a fill pattern.
   *
   * @default '#000'
   */
  color(color: GeographiesLabelsColorOptions | CSSType.Property.Fill): this {
    this._color = color;
    return this;
  }

  /**
   * OPTIONAL. The cursor to display when hovering over the text
   *
   * @default 'default'
   */
  cursor(cursor: CSSType.Property.Cursor): this {
    this._cursor = cursor;
    return this;
  }

  /**
   * OPTIONAL, A function that determines whether to display the label for a given feature.
   *
   * @default () => true
   */
  display(display: boolean): this;
  display(display: (featureIndex: string) => boolean): this;
  display(display: boolean | ((featureIndex: string) => boolean)): this {
    this._display = typeof display === 'boolean' ? () => display : display;
    return this;
  }

  /**
   * OPTIONAL. The dominant baseline of the text.
   *
   * @default 'middle'
   */
  dominantBaseline(dominantBaseline: CSSType.Property.DominantBaseline): this {
    this._dominantBaseline = dominantBaseline;
    return this;
  }

  /**
   * OPTIONAL. The font weight of the text.
   *
   * If an object is provided, the font weight for each property on the object will be used when the corresponding color is used.
   *
   * @default 400
   */
  fontWeight(
    fontWeight: GeographiesLabelsFontWeightOptions | CSSType.Property.FontWeight
  ): this {
    this._fontWeight = fontWeight;
    return this;
  }

  /**
   * The scale used to determine the font size of the label.
   */
  fontScale(fontScale: ScaleLinear<number, number, never>): this {
    this._fontScale = fontScale;
    return this;
  }

  /**
   * The pointer events of the text.
   */
  pointerEvents(pointerEvents: CSSType.Property.PointerEvents): this {
    this._pointerEvents = pointerEvents;
    return this;
  }

  /**
   * The position of the label relative to the feature
   */
  position(
    position: (
      d: GeographiesFeature<TProperties, TGeometry>,
      path: GeoPath,
      projection: GeoProjection
    ) => Position
  ): this {
    this._position = position;
    return this;
  }

  /**
   * The text anchor of the text.
   */
  textAnchor(textAnchor: CSSType.Property.TextAnchor): this {
    this._textAnchor = textAnchor;
    return this;
  }

  /**
   * A function that determines the value of the label for a given feature
   */
  valueAccessor(
    valueAccessor: (
      featureIndex: GeographiesFeature<TProperties, TGeometry>
    ) => string
  ): this {
    this._valueAccessor = valueAccessor;
    return this;
  }

  _build(): GeographiesLabels<TProperties, TGeometry> {
    return new GeographiesLabels<TProperties, TGeometry>({
      alignmentBaseline: this._alignmentBaseline,
      color: this._color,
      cursor: this._cursor,
      display: this._display,
      dominantBaseline: this._dominantBaseline,
      fontScale: this._fontScale,
      fontWeight: this._fontWeight,
      pointerEvents: this._pointerEvents,
      position: this._position,
      textAnchor: this._textAnchor,
      valueAccessor: this._valueAccessor,
    });
  }

  /**
   * A function to position something at the centroid of a feature.
   */
  positionAtCentroid<TProperties, TGeometry extends Geometry>(
    feature: GeographiesFeature<TProperties, TGeometry>,
    path: GeoPath
  ): Position {
    const c = path.centroid(feature);
    return { x: c[0], y: c[1] };
  }

  /**
   * A function to position a label for Hawaii on a GeoAlbersUsa projection.
   */
  positionHawaiiOnGeoAlbersUsa<TProperties>(
    feature: GeographiesFeature<TProperties, MultiPolygon>,
    projection: GeoProjection
  ): Position {
    const startPolygon =
      // we need to cast because Position can return two or three numbers but GeoProjection
      // can only handle [number, number]
      (feature.geometry.coordinates[0][0] as [number, number][]).map(
        projection
      );
    const endPolygon = (
      feature.geometry.coordinates[
        feature.geometry.coordinates.length - 1
      ][0] as [number, number][]
    ).map(projection);

    const approxStartCoords = startPolygon[0];
    const approxEndCoords = endPolygon[0];
    return {
      x: approxStartCoords[0] + (approxEndCoords[0] - approxStartCoords[0]) / 2,
      y: approxStartCoords[1],
    };
  }

  /**
   * A function to position a label with Polylabel lib
   */
  positionWithPolylabel<
    TProperties,
    TGeometry extends MultiPolygon | Polygon = MultiPolygon | Polygon,
  >(
    feature: GeographiesFeature<TProperties, TGeometry>,
    projection: GeoProjection
  ): Position {
    const isMultiPolygon = feature.geometry.coordinates.length > 1;
    let largestIndex = 0;
    let largestPolygon: [number, number][];
    if (isMultiPolygon) {
      const coords = feature.geometry.coordinates as [number, number][][][];
      largestIndex = maxIndex(
        coords.map((polygon) => {
          return polygonArea(polygon[0]);
        })
      );
      largestPolygon = coords[largestIndex][0];
    } else {
      const coords = feature.geometry.coordinates as [number, number][][];
      largestPolygon = coords[0];
    }
    const projectedPoints = largestPolygon.map(projection);
    const adjustedPosition = polylabel([projectedPoints]);
    return { x: adjustedPosition[0], y: adjustedPosition[1] };
  }
}

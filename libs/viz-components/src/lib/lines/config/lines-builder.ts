import { Injectable } from '@angular/core';
import { CurveFactory, curveLinear } from 'd3';
import { OrdinalVisualValueDimensionBuilder } from '../../data-dimensions/ordinal/ordinal-visual-value/ordinal-visual-value-builder';
import { DateChartPositionDimensionBuilder } from '../../data-dimensions/quantitative/date-chart-position/date-chart-position-builder';
import { NumberChartPositionDimensionBuilder } from '../../data-dimensions/quantitative/number-chart-position/number-chart-position-builder';
import { PrimaryMarksBuilder } from '../../marks/primary-marks/config/primary-marks-builder';
import { PointMarkersBuilder } from '../../point-markers/point-markers-builder';
import { AreaFillsBuilder } from './area-fills/area-fills-builder';
import { LinesConfig } from './lines-config';
import { LinesStrokeBuilder } from './stroke/lines-stroke-builder';

const DEFAULT = {
  _curve: curveLinear,
  _pointerDetectionRadius: 80,
  _lineLabelsFormat: (d: string) => d,
};

/**
 * Builds a configuration object for a LinesComponent.
 *
 * Must be added to a providers array in or above the component that consumes it if it is injected via the constructor. (e.g. `providers: [VicLinesBuilder]` in the component decorator)
 *
 * The generic parameter, Datum, is the type of the data that will be used to create the lines.
 */
@Injectable()
export class VicLinesConfigBuilder<Datum> extends PrimaryMarksBuilder<Datum> {
  private _curve: CurveFactory;
  private _labelLines: boolean;
  private _lineLabelsFormat: (d: string) => string;
  private _pointerDetectionRadius: number;
  private categoricalDimensionBuilder: OrdinalVisualValueDimensionBuilder<
    Datum,
    string,
    string
  >;
  private pointMarkersBuilder: PointMarkersBuilder<Datum>;
  private strokeBuilder: LinesStrokeBuilder;
  private xDimensionBuilder:
    | NumberChartPositionDimensionBuilder<Datum>
    | DateChartPositionDimensionBuilder<Datum>;
  private yDimensionBuilder: NumberChartPositionDimensionBuilder<Datum>;
  private areaFillsBuilder: AreaFillsBuilder<Datum>;

  constructor() {
    super();
    Object.assign(this, DEFAULT);
  }

  /**
   * OPTIONAL. A config to set the color of the lines.
   *
   * If not provided, all lines will be colored with the first color in `d3.schemeTableau10`, the default `range` for the dimension.
   */
  color(
    setProperties?: (
      dimension: OrdinalVisualValueDimensionBuilder<Datum, string, string>
    ) => void
  ): this {
    this.initCatetgoricalBuilder();
    setProperties?.(this.categoricalDimensionBuilder);
    return this;
  }

  private initCatetgoricalBuilder(): void {
    this.categoricalDimensionBuilder = new OrdinalVisualValueDimensionBuilder<
      Datum,
      string,
      string
    >();
  }

  /**
   * OPTIONAL. A function passed to D3's [line.curve()]{@link https://github.com/d3/d3-shape#line_curve}
   *  method.
   *
   * @default [curveLinear]{@link https://github.com/d3/d3-shape#curveLinear}.
   */
  curve(curve: CurveFactory): this {
    this._curve = curve;
    return this;
  }

  /**
   * OPTIONAL. A boolean to determine if the line will be labeled.
   */
  labelLines(labelLines: boolean): this {
    this._labelLines = labelLines;
    return this;
  }

  /**
   * OPTIONAL. A function that returns a string to be used as the label for a line. Can be used to modify the
   * line label string as needed.
   *
   * @default identity function.
   */
  lineLabelsFormat(lineLabelsFormat: (d: string) => string): this {
    this._lineLabelsFormat = lineLabelsFormat;
    return this;
  }

  /**
   * OPTIONAL. The distance from a line in which a hover event will trigger a tooltip, in px.
   *
   * This is used to ensure that a tooltip is triggered only when a user's pointer is close to lines.
   *
   * @default 80
   */
  pointerDetectionRadius(pointerDetectionRadius: number): this {
    this._pointerDetectionRadius = pointerDetectionRadius;
    return this;
  }

  /**
   * OPTIONAL. A config for the behavior of markers for each datum on the line.
   *
   * Creating this config will create markers on lines.
   */
  pointMarkers(
    setProperties?: (pointMarkers: PointMarkersBuilder<Datum>) => void
  ): this {
    this.pointMarkersBuilder = new PointMarkersBuilder();
    setProperties?.(this.pointMarkersBuilder);
    return this;
  }

  /**
   * OPTIONAL. A config for the behavior of the line stroke.
   */
  stroke(setProperties?: (stroke: LinesStrokeBuilder) => void): this {
    this.initStrokeBuilder();
    setProperties?.(this.strokeBuilder);
    return this;
  }

  private initStrokeBuilder(): void {
    this.strokeBuilder = new LinesStrokeBuilder();
  }

  /**
   * REQUIRED. A config for the behavior of the chart's x dimension when using numeric data.
   */
  xNumber(
    setProperties: (
      dimension: NumberChartPositionDimensionBuilder<Datum>
    ) => void
  ): this {
    this.xDimensionBuilder = new NumberChartPositionDimensionBuilder<Datum>();
    setProperties(this.xDimensionBuilder);
    return this;
  }

  /**
   * REQUIRED. A config for the behavior of the chart's x dimension when using Date date.
   */
  xDate(
    setProperties: (dimension: DateChartPositionDimensionBuilder<Datum>) => void
  ): this {
    this.xDimensionBuilder = new DateChartPositionDimensionBuilder<Datum>();
    setProperties(this.xDimensionBuilder);
    return this;
  }

  /**
   * REQUIRED. A config for the behavior of the chart's y dimension.
   */
  y(
    setProperties: (
      dimension: NumberChartPositionDimensionBuilder<Datum>
    ) => void
  ): this {
    this.yDimensionBuilder = new NumberChartPositionDimensionBuilder<Datum>();
    setProperties(this.yDimensionBuilder);
    return this;
  }

  /**
   * OPTIONAL. A config to set fill underneath lines.
   *
   */
  areaFills(
    setProperties?: (areaFills: AreaFillsBuilder<Datum>) => void
  ): this {
    this.initBelowLinesAreaFillBuilder();
    setProperties?.(this.areaFillsBuilder);
    return this;
  }

  private initBelowLinesAreaFillBuilder(): void {
    this.areaFillsBuilder = new AreaFillsBuilder();
  }

  /**
   * REQUIRED. Builds the configuration object for the LinesComponent.
   */
  getConfig(): LinesConfig<Datum> {
    this.validateBuilder();
    return new LinesConfig({
      color: this.categoricalDimensionBuilder._build('Color'),
      curve: this._curve,
      data: this._data,
      labelLines: this._labelLines,
      lineLabelsFormat: this._lineLabelsFormat,
      mixBlendMode: this._mixBlendMode,
      pointerDetectionRadius: this._pointerDetectionRadius,
      pointMarkers: this.pointMarkersBuilder?._build(),
      stroke: this.strokeBuilder._build(),
      x: this.xDimensionBuilder._build('X'),
      y: this.yDimensionBuilder._build('Y'),
      areaFills: this.areaFillsBuilder?._build(),
    });
  }

  protected override validateBuilder(): void {
    super.validateBuilder('Lines');
    if (this.strokeBuilder === undefined) {
      this.initStrokeBuilder();
    }
    if (!this.categoricalDimensionBuilder) {
      this.initCatetgoricalBuilder();
    }
    if (!this.xDimensionBuilder) {
      throw new Error(
        'Lines Builder: X dimension is required. Please use method `createXNumericDimension` or `createXDateDimension` to set it.'
      );
    }
    if (!this.yDimensionBuilder) {
      throw new Error(
        'Lines Builder: Y dimension is required. Please use method `createYDimension` to set it.'
      );
    }
  }
}

import { Injectable } from '@angular/core';
import { CurveFactory, curveLinear } from 'd3';
import { DateChartPositionDimensionBuilder } from '../../data-dimensions/continuous-quantitative/date-chart-position/date-chart-position-builder';
import { NumberChartPositionDimensionBuilder } from '../../data-dimensions/continuous-quantitative/number-chart-position/number-chart-position-builder';
import { PrimaryMarksBuilder } from '../../marks/primary-marks/config/primary-marks-builder';
import { PointMarkersBuilder } from '../../point-markers/point-markers-builder';
import { LinesStrokeBuilder } from '../config/stroke/lines-stroke-builder';
import { AreaFillsBuilder } from './area-fills/area-fills-builder';
import { LinesConfig } from './lines-config';

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
  private pointMarkersBuilder: PointMarkersBuilder<Datum>;
  private strokeBuilder: LinesStrokeBuilder<Datum>;
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
   * OPTIONAL. A config to set fill underneath lines.
   *
   * If no argument is provided, the default area fills will be created.
   *
   * To unset the area fills, call with `null`.
   */
  areaFills(): this;
  areaFills(areaFills: null): this;
  areaFills(areaFills: (areaFills: AreaFillsBuilder<Datum>) => void): this;
  areaFills(
    areaFills?: ((areaFills: AreaFillsBuilder<Datum>) => void) | null
  ): this {
    console.log('areaFills', areaFills);
    if (areaFills === null) {
      this.areaFillsBuilder = undefined;
      return this;
    }
    this.initBelowLinesAreaFillBuilder();
    areaFills?.(this.areaFillsBuilder);
    console.log('this.areaFillsBuilder', this.areaFillsBuilder);
    return this;
  }

  private initBelowLinesAreaFillBuilder(): void {
    this.areaFillsBuilder = new AreaFillsBuilder();
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
   * Creating this config will create markers on lines. If no argument is provided, the default markers will be created.
   */
  pointMarkers(): this;
  pointMarkers(pointMarkers: null): this;
  pointMarkers(
    pointMarkers: ((pointMarkers: PointMarkersBuilder<Datum>) => void) | null
  ): this;
  pointMarkers(
    pointMarkers?: ((pointMarkers: PointMarkersBuilder<Datum>) => void) | null
  ): this {
    if (pointMarkers === null) {
      this.pointMarkersBuilder = undefined;
      return this;
    }
    this.pointMarkersBuilder = new PointMarkersBuilder();
    pointMarkers?.(this.pointMarkersBuilder);
    return this;
  }

  /**
   * OPTIONAL. A config for the behavior of the line stroke.
   */
  stroke(stroke: null): this;
  stroke(stroke: (stroke: LinesStrokeBuilder<Datum>) => void): this;
  stroke(stroke: ((stroke: LinesStrokeBuilder<Datum>) => void) | null): this {
    if (stroke === null) {
      this.strokeBuilder = undefined;
      return this;
    }
    this.initStrokeBuilder();
    stroke(this.strokeBuilder);
    return this;
  }

  private initStrokeBuilder(): void {
    this.strokeBuilder = new LinesStrokeBuilder();
  }

  /**
   * REQUIRED. A config for the behavior of the chart's x dimension when using numeric data.
   */
  xNumeric(xNumeric: null): this;
  xNumeric(
    xNumeric: (x: NumberChartPositionDimensionBuilder<Datum>) => void
  ): this;
  xNumeric(
    x: ((x: NumberChartPositionDimensionBuilder<Datum>) => void) | null
  ): this {
    if (x === null) {
      this.xDimensionBuilder = undefined;
      return this;
    }
    this.xDimensionBuilder = new NumberChartPositionDimensionBuilder<Datum>();
    x(this.xDimensionBuilder);
    return this;
  }

  /**
   * REQUIRED. A config for the behavior of the chart's x dimension when using Date date.
   */
  xDate(xDate: null): this;
  xDate(xDate: (x: DateChartPositionDimensionBuilder<Datum>) => void): this;
  xDate(
    x: ((x: DateChartPositionDimensionBuilder<Datum>) => void) | null
  ): this {
    if (x === null) {
      this.xDimensionBuilder = undefined;
      return this;
    }
    this.xDimensionBuilder = new DateChartPositionDimensionBuilder<Datum>();
    x(this.xDimensionBuilder);
    return this;
  }

  /**
   * REQUIRED. A config for the behavior of the chart's y dimension.
   */
  y(y: null): this;
  y(y: (y: NumberChartPositionDimensionBuilder<Datum>) => void): this;
  y(y: ((y: NumberChartPositionDimensionBuilder<Datum>) => void) | null): this {
    if (y === null) {
      this.yDimensionBuilder = undefined;
      return this;
    }
    this.yDimensionBuilder = new NumberChartPositionDimensionBuilder<Datum>();
    y(this.yDimensionBuilder);
    return this;
  }

  /**
   * REQUIRED. Builds the configuration object for the LinesComponent.
   */
  getConfig(): LinesConfig<Datum> {
    this.validateBuilder();
    return new LinesConfig({
      marksClass: 'vic-lines',
      curve: this._curve,
      data: this._data,
      datumClass: this._class,
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

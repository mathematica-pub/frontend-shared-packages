import { Injectable } from '@angular/core';
import { CurveFactory, curveLinear } from 'd3';
import { CategoricalDimensionBuilder } from '../../data-dimensions/categorical/categorical-builder';
import { QuantitativeDateDimensionBuilder } from '../../data-dimensions/quantitative/quantitative-date-builder';
import { QuantitativeNumericDimensionBuilder } from '../../data-dimensions/quantitative/quantitative-numeric-builder';
import { DataMarksBuilder } from '../../data-marks/config/data-marks-builder';
import { PointMarkersBuilder } from '../../point-markers/point-markers-builder';
import { StrokeBuilder } from '../../stroke/stroke-builder';
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
export class VicLinesConfigBuilder<Datum> extends DataMarksBuilder<Datum> {
  private _curve: CurveFactory;
  private _labelLines: boolean;
  private _lineLabelsFormat: (d: string) => string;
  private _pointerDetectionRadius: number;
  private categoricalDimensionBuilder: CategoricalDimensionBuilder<Datum>;
  private pointMarkersBuilder: PointMarkersBuilder<Datum>;
  private strokeBuilder: StrokeBuilder;
  private xDimensionBuilder:
    | QuantitativeNumericDimensionBuilder<Datum>
    | QuantitativeDateDimensionBuilder<Datum>;
  private yDimensionBuilder: QuantitativeNumericDimensionBuilder<Datum>;

  constructor() {
    super();
    Object.assign(this, DEFAULT);
  }

  /**
   * OPTIONAL. A config for the behavior of the chart's categorical dimension.
   *
   * If not provided, all bars will be colored with the first color in `d3.schemeTableau10`, the default `range` for the dimension.
   */
  createCategoricalDimension(
    setProperties?: (dimension: CategoricalDimensionBuilder<Datum>) => void
  ): this {
    this.initCatetgoricalBuilder();
    setProperties?.(this.categoricalDimensionBuilder);
    return this;
  }

  private initCatetgoricalBuilder(): void {
    this.categoricalDimensionBuilder = new CategoricalDimensionBuilder<Datum>();
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
  createPointMarkers(
    setProperties?: (pointMarkers: PointMarkersBuilder<Datum>) => void
  ): this {
    this.pointMarkersBuilder = new PointMarkersBuilder();
    setProperties?.(this.pointMarkersBuilder);
    return this;
  }

  /**
   * OPTIONAL. A config for the behavior of the line stroke.
   */
  createStroke(setProperties?: (stroke: StrokeBuilder) => void): this {
    this.initStrokeBuilder();
    setProperties?.(this.strokeBuilder);
    return this;
  }

  private initStrokeBuilder(): void {
    this.strokeBuilder = new StrokeBuilder();
  }

  /**
   * REQUIRED. A config for the behavior of the chart's x dimension when using numeric data.
   */
  createXNumericDimension(
    setProperties: (
      dimension: QuantitativeNumericDimensionBuilder<Datum>
    ) => void
  ): this {
    this.xDimensionBuilder = new QuantitativeNumericDimensionBuilder<Datum>();
    setProperties(this.xDimensionBuilder);
    return this;
  }

  /**
   * REQUIRED. A config for the behavior of the chart's x dimension when using Date date.
   */
  createXDateDimension(
    setProperties: (dimension: QuantitativeDateDimensionBuilder<Datum>) => void
  ): this {
    this.xDimensionBuilder = new QuantitativeDateDimensionBuilder<Datum>();
    setProperties(this.xDimensionBuilder);
    return this;
  }

  /**
   * REQUIRED. A config for the behavior of the chart's y dimension.
   */
  createYDimension(
    setProperties: (
      dimension: QuantitativeNumericDimensionBuilder<Datum>
    ) => void
  ): this {
    this.yDimensionBuilder = new QuantitativeNumericDimensionBuilder<Datum>();
    setProperties(this.yDimensionBuilder);
    return this;
  }

  /**
   * REQUIRED. Builds the configuration object for the LinesComponent.
   */
  getConfig(): LinesConfig<Datum> {
    this.validateBuilder();
    return new LinesConfig({
      categorical: this.categoricalDimensionBuilder._build(),
      curve: this._curve,
      data: this._data,
      labelLines: this._labelLines,
      lineLabelsFormat: this._lineLabelsFormat,
      mixBlendMode: this._mixBlendMode,
      pointerDetectionRadius: this._pointerDetectionRadius,
      pointMarkers: this.pointMarkersBuilder?._build(),
      stroke: this.strokeBuilder._build(),
      x: this.xDimensionBuilder._build(),
      y: this.yDimensionBuilder._build(),
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

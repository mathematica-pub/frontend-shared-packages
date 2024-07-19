import { Injectable } from '@angular/core';
import { CurveFactory, curveLinear, schemeTableau10 } from 'd3';
import { CategoricalDimensionBuilder } from '../../data-dimensions/categorical/categorical-builder';
import { QuantitativeDateDimensionBuilder } from '../../data-dimensions/quantitative/quantitative-date-builder';
import { QuantitativeNumericDimensionBuilder } from '../../data-dimensions/quantitative/quantitative-numeric-builder';
import { DataMarksBuilder } from '../../data-marks/config/data-marks-builder';
import { PointMarkersBuilder } from '../../marks/point-markers/point-markers-builder';
import { VicStrokeBuilder } from '../../marks/stroke/stroke-builder';
import { VicLinesConfig } from './lines-config';

const DEFAULT = {
  _curve: curveLinear,
  _pointerDetectionRadius: 80,
  _lineLabelsFormat: (d: string) => d,
};

@Injectable()
export class VicLinesBuilder<Datum> extends DataMarksBuilder<Datum> {
  private _curve: CurveFactory;
  private _labelLines: boolean;
  private _lineLabelsFormat: (d: string) => string;
  private _pointerDetectionRadius: number;
  private categoricalDimensionBuilder: CategoricalDimensionBuilder<Datum>;
  private hoverDotBuilder: PointMarkersBuilder;
  private pointMarkersBuilder: PointMarkersBuilder;
  private strokeBuilder: VicStrokeBuilder;
  private xDimensionBuilder:
    | QuantitativeNumericDimensionBuilder<Datum>
    | QuantitativeDateDimensionBuilder<Datum>;
  private yDimensionBuilder: QuantitativeNumericDimensionBuilder<Datum>;

  constructor() {
    super();
    Object.assign(this, DEFAULT);
  }

  /**
   * A config for the behavior of the chart's categorical dimension.
   *
   * Default colors array is D3's [schemeTableau10]{@link https://github.com/d3/d3-scale-chromatic#schemeTableau10}.
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
    this.categoricalDimensionBuilder.range(schemeTableau10 as string[]);
  }

  /**
   * A function passed to D3's [line.curve()]{@link https://github.com/d3/d3-shape#line_curve}
   *  method.
   *
   * Default is [curveLinear]{@link https://github.com/d3/d3-shape#curveLinear}.
   */
  curve(curve: CurveFactory): this {
    this._curve = curve;
    return this;
  }

  /**
   * A config for a dot that will appear on hover of a line. Intended to be used when there
   *  are no point markers along the line (i.e. at all points), particularly when a tooltip with point-specific
   *  data will be displayed. Will not be displayed if pointMarkers.display is true.
   */
  createHoverDot(
    setProperties?: (pointMarkers: PointMarkersBuilder) => void
  ): this {
    this.hoverDotBuilder = new PointMarkersBuilder();
    this.hoverDotBuilder.radius(4);
    this.hoverDotBuilder.display(false);
    setProperties?.(this.hoverDotBuilder);
    return this;
  }

  /**
   * A boolean to determine if the line will be labeled.
   */
  labelLines(labelLines: boolean): this {
    this._labelLines = labelLines;
    return this;
  }

  /**
   * A function that returns a string to be used as the label for a line. Can be used to modify the
   * line label string as needed.
   *
   * Default is the identity function.
   */
  lineLabelsFormat(lineLabelsFormat: (d: string) => string): this {
    this._lineLabelsFormat = lineLabelsFormat;
    return this;
  }

  /**
   * The distance from a line in which a hover event will trigger a tooltip, in px.
   *  Default is 80.
   *
   * This is used to ensure that a tooltip is triggered only when a user's pointer is close to lines.
   */
  pointerDetectionRadius(pointerDetectionRadius: number): this {
    this._pointerDetectionRadius = pointerDetectionRadius;
    return this;
  }

  /**
   * A config for the behavior of markers for each datum on the line.
   */

  createPointMarkers(
    setProperties?: (pointMarkers: PointMarkersBuilder) => void
  ): this {
    this.pointMarkersBuilder = new PointMarkersBuilder();
    setProperties?.(this.pointMarkersBuilder);
    return this;
  }

  /**
   * A config for the behavior of the line stroke.
   */
  createStroke(setProperties?: (stroke: VicStrokeBuilder) => void): this {
    this.initStroke();
    setProperties?.(this.strokeBuilder);
    return this;
  }

  private initStroke(): void {
    this.strokeBuilder = new VicStrokeBuilder();
  }

  /**
   * A config for the behavior of the chart's x dimension.
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

  createXDateDimension(
    setProperties: (dimension: QuantitativeDateDimensionBuilder<Datum>) => void
  ): this {
    this.xDimensionBuilder = new QuantitativeDateDimensionBuilder<Datum>();
    setProperties(this.xDimensionBuilder);
    return this;
  }

  /**
   * A config for the behavior of the chart's y dimension.
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

  build(): VicLinesConfig<Datum> {
    if (this.strokeBuilder === undefined) {
      this.initStroke();
    }
    return new VicLinesConfig({
      categorical: this.categoricalDimensionBuilder.build(),
      curve: this._curve,
      data: this._data,
      hoverDot: this.hoverDotBuilder?.build(),
      labelLines: this._labelLines,
      lineLabelsFormat: this._lineLabelsFormat,
      mixBlendMode: this._mixBlendMode,
      pointerDetectionRadius: this._pointerDetectionRadius,
      pointMarkers: this.pointMarkersBuilder?.build(),
      stroke: this.strokeBuilder.build(),
      x: this.xDimensionBuilder.build(),
      y: this.yDimensionBuilder.build(),
    });
  }
}

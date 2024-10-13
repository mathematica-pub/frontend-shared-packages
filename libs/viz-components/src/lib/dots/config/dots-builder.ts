import { Injectable } from '@angular/core';
import { QuantitativeNumericDimensionBuilder } from '../../data-dimensions/quantitative/quantitative-numeric-builder';
import { PrimaryMarksBuilder } from '../../marks/primary-marks/config/primary-marks-builder';
import { StrokeBuilder } from '../../stroke/stroke-builder';
import { DotsConfig } from './dots-config';

const DEFAULT = {
  _pointerDetectionRadius: 12,
  _fill: 'none',
  _radius: 2,
};

@Injectable()
export class VicDotsConfigBuilder<Datum> extends PrimaryMarksBuilder<Datum> {
  private _fill: string;
  private _radius: number;
  private _pointerDetectionRadius: number;
  private strokeBuilder: StrokeBuilder;
  private xDimensionBuilder: QuantitativeNumericDimensionBuilder<Datum>;
  private yDimensionBuilder: QuantitativeNumericDimensionBuilder<Datum>;

  constructor() {
    super();
    Object.assign(this, DEFAULT);
  }

  /**
   * OPTIONAL. The fill of the dots.
   *
   * This is temporarily a constant.
   *
   * @default 'none'
   */
  fill(fill: string): this {
    this._fill = fill;
    return this;
  }

  /**
   * OPTIONAL. The distance from a line in which a hover event will trigger a tooltip, in px.
   *
   * This is used to ensure that a tooltip is triggered only when a user's pointer is close to lines.
   *
   * @default 12
   */
  pointerDetectionRadius(pointerDetectionRadius: number): this {
    this._pointerDetectionRadius = pointerDetectionRadius;
    return this;
  }

  /**
   * OPTIONAL. The size of the radius of the dots
   *
   * This is temporarily a constant.
   *
   * @default 2
   */
  radius(radius: number): this {
    this._radius = radius;
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
  createXDimension(
    setProperties: (
      dimension: QuantitativeNumericDimensionBuilder<Datum>
    ) => void
  ): this {
    this.xDimensionBuilder = new QuantitativeNumericDimensionBuilder<Datum>();
    setProperties(this.xDimensionBuilder);
    return this;
  }

  /**
   * REQUIRED. A config for the behavior of the chart's x dimension when using numeric data.
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
   * REQUIRED. Validates and builds the configuration object for the bars that can be passed to BarsComponent.
   *
   * The user must call this at the end of the chain of methods to build the configuration object.
   */
  getConfig(): DotsConfig<Datum> {
    this.validateBuilder();
    return new DotsConfig<Datum>({
      data: this._data,
      fill: this._fill,
      mixBlendMode: this._mixBlendMode,
      pointerDetectionRadius: this._pointerDetectionRadius,
      radius: this._radius,
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
    if (!this.xDimensionBuilder) {
      throw new Error(
        'Dots Builder: X dimension is required. Please use method `createXDimension` to set it.'
      );
    }
    if (!this.yDimensionBuilder) {
      throw new Error(
        'Dots Builder: Y dimension is required. Please use method `createYDimension` to set it.'
      );
    }
  }
}

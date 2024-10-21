import { Injectable } from '@angular/core';
import { schemeTableau10 } from 'd3';
import { OrdinalVisualValueDimensionBuilder } from '../../data-dimensions/ordinal/ordinal-visual-value/ordinal-visual-value-builder';
import { DateChartPositionDimensionBuilder } from '../../data-dimensions/quantitative/date-chart-position/date-chart-position-builder';
import { NumberChartPositionDimensionBuilder } from '../../data-dimensions/quantitative/number-chart-position/number-chart-position-builder';
import { NumberVisualValueDimensionBuilder } from '../../data-dimensions/quantitative/number-visual-value/number-visual-value-builder';
import { PrimaryMarksBuilder } from '../../marks/primary-marks/config/primary-marks-builder';
import { StrokeBuilder } from '../../stroke/stroke-builder';
import { DotsConfig } from './dots-config';

const DEFAULT = {
  _pointerDetectionRadius: 12,
  _fill: 'none',
  _opacity: 1,
  _radius: 2,
};

@Injectable()
export class VicDotsConfigBuilder<Datum> extends PrimaryMarksBuilder<Datum> {
  private _opacity: number;
  private _pointerDetectionRadius: number;
  private fillBuilderOrdinal: OrdinalVisualValueDimensionBuilder<
    Datum,
    string,
    string
  >;
  private fillBuilderNumber: NumberVisualValueDimensionBuilder<Datum, string>;
  private radiusBuilderOrdinal: OrdinalVisualValueDimensionBuilder<
    Datum,
    string,
    number
  >;
  private radiusBuilderNumber: NumberVisualValueDimensionBuilder<Datum, number>;
  private strokeBuilder: StrokeBuilder;
  private xDimensionBuilder:
    | NumberChartPositionDimensionBuilder<Datum>
    | DateChartPositionDimensionBuilder<Datum>;
  private yDimensionBuilder: NumberChartPositionDimensionBuilder<Datum>;

  constructor() {
    super();
    Object.assign(this, DEFAULT);
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
   * OPTIONAL. Sets the opacity of the dots.
   *
   * @default 1
   */
  opacity(opacity: number): this {
    this._opacity = opacity;
    return this;
  }

  /**
   * OPTIONAL. Sets the appearance of the fill for the dots.
   *
   * If a string is passed, it will be used as the color for all dots.
   *
   * Otherwise the user can pass a function that will set the properties of the fill.
   *
   * @default 'schemeTableau10[0]'
   */
  fill(fill: string): this {
    this.initFillBuilderOrdinal();
    this.fillBuilderOrdinal.valueAccessor(() => null).range([fill]);
    return this;
  }

  fillOrdinal(
    setProperties: (
      fill: OrdinalVisualValueDimensionBuilder<Datum, string, string>
    ) => void
  ): this {
    this.initFillBuilderOrdinal();
    setProperties(this.fillBuilderOrdinal);
    return this;
  }

  private initFillBuilderOrdinal(): void {
    this.fillBuilderOrdinal = new OrdinalVisualValueDimensionBuilder();
  }

  fillNumber(
    setProperties: (
      fill: NumberVisualValueDimensionBuilder<Datum, string>
    ) => void
  ): this {
    this.initFillBuilderNumber();
    setProperties(this.fillBuilderNumber);
    return this;
  }

  private initFillBuilderNumber(): void {
    this.fillBuilderNumber = new NumberVisualValueDimensionBuilder();
  }

  /**
   * OPTIONAL. The size of the radius of the dots
   *
   * This is temporarily a constant.
   *
   * @default 2
   */
  radius(radius: number): this {
    this.initRadiusBuilderOrdinal();
    this.radiusBuilderOrdinal.range([radius]);
    return this;
  }

  radiusOrdinal(
    setProperties: (
      radius: OrdinalVisualValueDimensionBuilder<Datum, string, number>
    ) => void
  ): this {
    this.initRadiusBuilderOrdinal();
    setProperties(this.radiusBuilderOrdinal);
    return this;
  }

  private initRadiusBuilderOrdinal(): void {
    this.radiusBuilderOrdinal = new OrdinalVisualValueDimensionBuilder();
  }

  radiusNumber(
    setProperties: (
      radius: NumberVisualValueDimensionBuilder<Datum, number>
    ) => void
  ): this {
    this.initRadiusBuilderNumber();
    setProperties(this.radiusBuilderNumber);
    return this;
  }

  private initRadiusBuilderNumber(): void {
    this.radiusBuilderNumber = new NumberVisualValueDimensionBuilder();
  }

  /**
   * OPTIONAL. Sets the appearance of the stroke for the dots.
   */
  stroke(setProperties?: (stroke: StrokeBuilder) => void): this {
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
  x(
    setProperties: (
      dimension: NumberChartPositionDimensionBuilder<Datum>
    ) => void
  ): this {
    this.xDimensionBuilder = new NumberChartPositionDimensionBuilder<Datum>();
    setProperties(this.xDimensionBuilder);
    return this;
  }

  /**
   * REQUIRED. A config for the behavior of the chart's x dimension when using numeric data.
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
   * REQUIRED. Validates and builds the configuration object for the bars that can be passed to BarsComponent.
   *
   * The user must call this at the end of the chain of methods to build the configuration object.
   */
  getConfig(): DotsConfig<Datum> {
    this.validateBuilder();
    return new DotsConfig<Datum>({
      data: this._data,
      fill: this.fillBuilderOrdinal
        ? this.fillBuilderOrdinal._build()
        : this.fillBuilderNumber._build(),
      mixBlendMode: this._mixBlendMode,
      opacity: this._opacity,
      pointerDetectionRadius: this._pointerDetectionRadius,
      radius: this.radiusBuilderOrdinal
        ? this.radiusBuilderOrdinal._build()
        : this.radiusBuilderNumber._build(),
      stroke: this.strokeBuilder?._build(),
      x: this.xDimensionBuilder._build(),
      y: this.yDimensionBuilder._build(),
    });
  }

  protected override validateBuilder(): void {
    super.validateBuilder('Lines');
    if (
      this.fillBuilderOrdinal === undefined &&
      this.fillBuilderNumber === undefined
    ) {
      this.initFillBuilderOrdinal();
      this.fillBuilderOrdinal.range([schemeTableau10[0]]);
    }
    if (this.fillBuilderOrdinal && this.fillBuilderNumber) {
      throw new Error(
        'Dots Builder: Fill can only be set for ordinal or number data, not both.'
      );
    }
    if (
      this.radiusBuilderOrdinal === undefined &&
      this.radiusBuilderNumber === undefined
    ) {
      this.initRadiusBuilderOrdinal();
      this.radiusBuilderOrdinal.range([2]);
    }
    if (this.radiusBuilderOrdinal && this.radiusBuilderNumber) {
      throw new Error(
        'Dots Builder: Radius can only be set for ordinal or number data, not both.'
      );
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

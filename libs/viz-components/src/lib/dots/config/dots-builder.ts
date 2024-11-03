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
  private _key: (datum: Datum) => string;
  private _opacity: number;
  private _pointerDetectionRadius: number;
  private fillBuilderCategorical: OrdinalVisualValueDimensionBuilder<
    Datum,
    string,
    string
  >;
  private fillBuilderNumber: NumberVisualValueDimensionBuilder<Datum, string>;
  private radiusBuilderCategorical: OrdinalVisualValueDimensionBuilder<
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
    this.initFillBuilderCategorical();
    this.fillBuilderCategorical.valueAccessor(() => '').range([fill]);
    return this;
  }

  fillCategorical(
    setProperties: (
      fill: OrdinalVisualValueDimensionBuilder<Datum, string, string>
    ) => void
  ): this {
    this.initFillBuilderCategorical();
    setProperties(this.fillBuilderCategorical);
    return this;
  }

  private initFillBuilderCategorical(): void {
    this.fillBuilderCategorical = new OrdinalVisualValueDimensionBuilder();
  }

  fillNumeric(
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
   * OPTIONAL. Sets a key that will be set as a `key` attribute on the SVGGElement that is the parent for each SVGCircleElement.
   *
   * Can be used to differentiate between dots.
   *
   * No key wil be set if this method is not called.
   */
  key(key: (datum: Datum) => string): this {
    this._key = key;
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
    this.initRadiusBuilderCategorical();
    this.radiusBuilderCategorical.range([radius]);
    return this;
  }

  radiusCategorical(
    setProperties: (
      radius: OrdinalVisualValueDimensionBuilder<Datum, string, number>
    ) => void
  ): this {
    this.initRadiusBuilderCategorical();
    setProperties(this.radiusBuilderCategorical);
    return this;
  }

  private initRadiusBuilderCategorical(): void {
    this.radiusBuilderCategorical = new OrdinalVisualValueDimensionBuilder();
  }

  radiusNumeric(
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
    const fillName = 'Fill';
    const radiusName = 'Radius';
    return new DotsConfig<Datum>({
      data: this._data,
      fill: this.fillBuilderCategorical
        ? this.fillBuilderCategorical._build(fillName)
        : this.fillBuilderNumber._build(fillName),
      key: this._key,
      mixBlendMode: this._mixBlendMode,
      opacity: this._opacity,
      pointerDetectionRadius: this._pointerDetectionRadius,
      radius: this.radiusBuilderCategorical
        ? this.radiusBuilderCategorical._build(radiusName)
        : this.radiusBuilderNumber._build(radiusName),
      stroke: this.strokeBuilder?._build(),
      x: this.xDimensionBuilder._build('X'),
      y: this.yDimensionBuilder._build('Y'),
    });
  }

  protected override validateBuilder(): void {
    super.validateBuilder('Lines');
    if (
      this.fillBuilderCategorical === undefined &&
      this.fillBuilderNumber === undefined
    ) {
      this.fillBuilderCategorical = new OrdinalVisualValueDimensionBuilder();
      this.fillBuilderCategorical.range([schemeTableau10[0]]);
    }
    if (this.fillBuilderCategorical && this.fillBuilderNumber) {
      throw new Error(
        'Dots Builder: Fill can only be set for ordinal or number data, not both.'
      );
    }
    if (
      this.radiusBuilderCategorical === undefined &&
      this.radiusBuilderNumber === undefined
    ) {
      this.radiusBuilderCategorical = new OrdinalVisualValueDimensionBuilder();
      this.radiusBuilderCategorical.range([2]);
    }
    if (this.radiusBuilderCategorical && this.radiusBuilderNumber) {
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

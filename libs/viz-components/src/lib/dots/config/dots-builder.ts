import { Injectable } from '@angular/core';
import { OrdinalVisualValueDimensionBuilder } from '../../data-dimensions/ordinal/ordinal-visual-value/ordinal-visual-value-builder';
import { NumberChartPositionDimensionBuilder } from '../../data-dimensions/quantitative/number-chart-position/number-chart-position-builder';
import { NumberVisualValueDimensionBuilder } from '../../data-dimensions/quantitative/number-visual-value/number-visual-value-builder';
import { PrimaryMarksBuilder } from '../../marks/primary-marks/config/primary-marks-builder';
import { OutlineStrokeBuilder } from '../../stroke/outline-stroke/outline-stroke-builder';
import { DotsConfig } from './dots-config';
import { DataValue } from '../../core';
import { DateChartPositionDimensionBuilder } from '../../data-dimensions/quantitative/date-chart-position/date-chart-position-builder';

const DEFAULT = {
  _pointerDetectionRadius: 12,
  _fill: 'none',
  _radius: 2,
};

@Injectable()
export class VicDotsConfigBuilder<Datum, FillDomain extends DataValue, RadiusDomain extends DataValue> extends PrimaryMarksBuilder<Datum> {
  private _pointerDetectionRadius: number;
  private fillBuilder: OrdinalVisualValueDimensionBuilder<Datum, FillDomain, string> | NumberVisualValueDimensionBuilder<Datum, string>;
  private radiusBuilder: OrdinalVisualValueDimensionBuilder<Datum, RadiusDomain, string> | NumberVisualValueDimensionBuilder<Datum, number>;
  private strokeBuilder: OutlineStrokeBuilder;
  private xDimensionBuilder: NumberChartPositionDimensionBuilder<Datum> | DateChartPositionDimensionBuilder<Datum>;
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
   * OPTIONAL. Sets the appearance of the fill for the dots.
   *
   * If a string is passed, it will be used as the color for all dots.
   *
   * Otherwise the user can pass a function that will set the properties of the fill.
   *
   * @default 'schemeTableau10[0]'
   */
  fill(setProperties: string | ((color: OrdinalVisualValueDimensionBuilder<Datum, FillDomain, string>) => void) | ((color: NumberVisualValueDimensionBuilder<Datum, string>) => void)): this {
    this.initFillBuilder();
    if (typeof setProperties === 'string') {
      this.fillBuilder.valueAccessor(() => null).range([setProperties]);
    } else {
      setProperties?.(this.fillBuilder);
    }
    return this;
  }

  private initFillBuilder(): void {
    this.fillBuilder = new OrdinalVisualValueDimensionBuilder();
  }

  /**
   * OPTIONAL. The size of the radius of the dots
   *
   * This is temporarily a constant.
   *
   * @default 2
   */
  radius(
    setProperties:
      | number
      | ((radius: NumberVisualValueDimensionBuilder<Datum, number>) => void)
  ): this {
    this.initRadiusBuilder();
    if (typeof setProperties === 'number') {
      this.radiusBuilder.valueAccessor(() => null).range([setProperties]);
    } else {
      setProperties.(this.radiusBuilder);
    }
    return this;
  }

  private initRadiusBuilder(): void {
    this.radiusBuilder = new NumberVisualValueDimensionBuilder();
  }

  /**
   * OPTIONAL. Sets the appearance of the stroke for the dots.
   */
  stroke(setProperties?: (stroke: OutlineStrokeBuilder) => void): this {
    this.initStrokeBuilder();
    setProperties?.(this.strokeBuilder);
    return this;
  }

  private initStrokeBuilder(): void {
    this.strokeBuilder = new OutlineStrokeBuilder();
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
      fill: this.fillBuilder._build(),
      mixBlendMode: this._mixBlendMode,
      pointerDetectionRadius: this._pointerDetectionRadius,
      radius: this.radiusBuilder._build(),
      stroke: this.strokeBuilder._build(),
      x: this.xDimensionBuilder._build(),
      y: this.yDimensionBuilder._build(),
    });
  }

  protected override validateBuilder(): void {
    super.validateBuilder('Lines');
    if (this.fillBuilder === undefined) {
      this.initFillBuilder();
    }
    if (this.radiusBuilder === undefined) {
      this.initRadiusBuilder();
    }
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

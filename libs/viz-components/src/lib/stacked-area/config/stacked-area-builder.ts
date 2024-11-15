import { Injectable } from '@angular/core';
import {
  CurveFactory,
  curveLinear,
  InternMap,
  Series,
  stackOffsetNone,
  stackOrderNone,
} from 'd3';
import { ContinuousValue, DataValue } from '../../core/types/values';
import { OrdinalVisualValueDimensionBuilder } from '../../data-dimensions/ordinal/ordinal-visual-value/ordinal-visual-value-builder';
import { DateChartPositionDimensionBuilder } from '../../data-dimensions/quantitative/date-chart-position/date-chart-position-builder';
import { NumberChartPositionDimensionBuilder } from '../../data-dimensions/quantitative/number-chart-position/number-chart-position-builder';
import { PrimaryMarksBuilder } from '../../marks/primary-marks/config/primary-marks-builder';
import { StackedAreaConfig } from './stacked-area-config';

const DEFAULT = {
  _curve: curveLinear,
  _stackOrder: stackOrderNone,
  _stackOffset: stackOffsetNone,
};

/**
 * Builds a configuration object for a StackedAreaComponent.
 *
 * Must be added to a providers array in or above the component that consumes it if it is injected via the constructor. (e.g. `providers: [VicStackedAreaBuilder]` in the component decorator)
 *
 * The first generic parameter, Datum, is the type of the data that will be used to create the stacked area chart.
 *
 * The second generic parameter, TCategoricalValue, is the type of the categorical data that will be used to stack the areas.
 */
@Injectable()
export class VicStackedAreaConfigBuilder<
  Datum,
  TCategoricalValue extends DataValue,
> extends PrimaryMarksBuilder<Datum> {
  private categoricalDimensionBuilder: OrdinalVisualValueDimensionBuilder<
    Datum,
    TCategoricalValue
  >;
  private _categoricalOrder: TCategoricalValue[];
  private _curve: CurveFactory;
  private _stackOrder: (
    series: Series<
      [ContinuousValue, InternMap<TCategoricalValue, number>],
      TCategoricalValue
    >
  ) => Iterable<number>;
  private _stackOffset: (
    series: Series<
      [ContinuousValue, InternMap<TCategoricalValue, number>],
      TCategoricalValue
    >,
    order: number[]
  ) => void;
  private xDimensionBuilder:
    | NumberChartPositionDimensionBuilder<Datum>
    | DateChartPositionDimensionBuilder<Datum>;
  private yDimensionBuilder: NumberChartPositionDimensionBuilder<Datum>;

  constructor() {
    super();
    Object.assign(this, DEFAULT);
  }

  /**
   * REQUIRED. Sets the categorical dimension for the stacked area chart.
   */
  color(
    setProperties: (
      dimension: OrdinalVisualValueDimensionBuilder<Datum, TCategoricalValue>
    ) => void
  ): this {
    this.categoricalDimensionBuilder = new OrdinalVisualValueDimensionBuilder<
      Datum,
      TCategoricalValue
    >();
    setProperties(this.categoricalDimensionBuilder);
    return this;
  }

  /**
   * OPTIONAL. Allows user to provide a custom order for the categories of data / the stack.
   *
   * If not provided, the order will be determined by d3.
   */
  categoricalOrder(value: TCategoricalValue[]): this {
    this._categoricalOrder = value;
    return this;
  }

  /**
   * OPTIONAL. Sets the curve factory for the line.
   *
   * @default curveLinear
   */
  curve(value: CurveFactory): this {
    this._curve = value;
    return this;
  }

  /**
   * OPTIONAL: Sets the order of the stack.
   *
   * @default stackOrderNone
   */
  stackOrder(
    value: (
      series: Series<
        [ContinuousValue, InternMap<TCategoricalValue, number>],
        TCategoricalValue
      >
    ) => Iterable<number>
  ): this {
    this._stackOrder = value;
    return this;
  }

  /**
   * OPTIONAL. Sets the offset of the stack.
   *
   * @default stackOffsetNone
   */
  stackOffset(
    value: (
      series: Series<
        [ContinuousValue, InternMap<TCategoricalValue, number>],
        TCategoricalValue
      >,
      order: number[]
    ) => void
  ): this {
    this._stackOffset = value;
    return this;
  }

  /**
   * REQUIRED. Sets the x dimension for the stacked area chart when using numeric data.
   */
  xNumeric(
    setProperties: (
      dimension: NumberChartPositionDimensionBuilder<Datum>
    ) => void
  ): this {
    this.xDimensionBuilder = new NumberChartPositionDimensionBuilder<Datum>();
    setProperties(this.xDimensionBuilder);
    return this;
  }

  /**
   * REQUIRED. Sets the x dimension for the stacked area chart when using Date data.
   */
  xDate(
    setProperties: (dimension: DateChartPositionDimensionBuilder<Datum>) => void
  ): this {
    this.xDimensionBuilder = new DateChartPositionDimensionBuilder<Datum>();
    setProperties(this.xDimensionBuilder);
    return this;
  }

  /**
   * REQUIRED. Sets the y dimension for the stacked area chart.
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
   * REQUIRED. Builds the configuration object for the stacked area chart.
   */
  getConfig(): StackedAreaConfig<Datum, TCategoricalValue> {
    this.validateBuilder();
    return new StackedAreaConfig({
      color: this.categoricalDimensionBuilder._build(),
      categoricalOrder: this._categoricalOrder,
      curve: this._curve,
      data: this._data,
      mixBlendMode: this._mixBlendMode,
      stackOrder: this._stackOrder,
      stackOffset: this._stackOffset,
      x: this.xDimensionBuilder._build(),
      y: this.yDimensionBuilder._build(),
    });
  }

  protected override validateBuilder(): void {
    super.validateBuilder('Stacked Area');
    if (!this.categoricalDimensionBuilder) {
      throw new Error(
        'Stacked Area Builder: Categorical dimension must be created. Please use method `createCategoricalDimension` to set the categorical dimension.'
      );
    }
    if (!this.xDimensionBuilder) {
      throw new Error(
        'Stacked Area Builder: X dimension must be created. Please use method `createXNumericDimension` or `createXDateDimension` to set the x dimension.'
      );
    }
    if (!this.yDimensionBuilder) {
      throw new Error(
        'Stacked Area Builder: Y dimension must be created. Please use method `createYNumericDimension` to set the y dimension.'
      );
    }
  }
}

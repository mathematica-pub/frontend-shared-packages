import { Injectable } from '@angular/core';
import { safeAssign } from '@mathstack/app-kit';
import {
  CurveFactory,
  curveLinear,
  InternMap,
  Series,
  stackOffsetNone,
  stackOrderNone,
} from 'd3';
import { ContinuousValue, DataValue } from '../../core/types/values';
import { DateChartPositionDimensionBuilder } from '../../data-dimensions/continuous-quantitative/date-chart-position/date-chart-position-builder';
import { NumberChartPositionDimensionBuilder } from '../../data-dimensions/continuous-quantitative/number-chart-position/number-chart-position-builder';
import { OrdinalVisualValueDimensionBuilder } from '../../data-dimensions/ordinal/ordinal-visual-value/ordinal-visual-value-builder';
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
  CategoricalDomain extends DataValue,
> extends PrimaryMarksBuilder<Datum> {
  private colorDimensionBuilder: OrdinalVisualValueDimensionBuilder<
    Datum,
    CategoricalDomain,
    string
  >;
  private _categoricalOrder: CategoricalDomain[];
  private _curve: CurveFactory;
  private _stackOrder: (
    series: Series<
      [ContinuousValue, InternMap<CategoricalDomain, number>],
      CategoricalDomain
    >
  ) => Iterable<number>;
  private _stackOffset: (
    series: Series<
      [ContinuousValue, InternMap<CategoricalDomain, number>],
      CategoricalDomain
    >,
    order: number[]
  ) => void;
  private xDimensionBuilder:
    | NumberChartPositionDimensionBuilder<Datum>
    | DateChartPositionDimensionBuilder<Datum>;
  private yDimensionBuilder: NumberChartPositionDimensionBuilder<Datum>;

  constructor() {
    super();
    safeAssign(this, DEFAULT);
  }

  /**
   * REQUIRED. Sets the categorical dimension for the stacked area chart.
   */
  color(
    color: (
      color: OrdinalVisualValueDimensionBuilder<
        Datum,
        CategoricalDomain,
        string
      >
    ) => void
  ): this {
    this.colorDimensionBuilder = new OrdinalVisualValueDimensionBuilder<
      Datum,
      CategoricalDomain,
      string
    >();
    color(this.colorDimensionBuilder);
    return this;
  }

  /**
   * OPTIONAL. Allows user to provide a custom order for the categories of data / the stack.
   *
   * If not provided, the order will be determined by d3.
   */
  categoricalOrder(value: CategoricalDomain[]): this {
    if (value === null) {
      this._categoricalOrder = undefined;
      return this;
    }
    this._categoricalOrder = value;
    return this;
  }

  /**
   * OPTIONAL. Sets the curve factory for the line.
   *
   * @default curveLinear
   */
  curve(value: null): this;
  curve(value: CurveFactory): this;
  curve(value: CurveFactory | null): this {
    if (value === null) {
      this._curve = DEFAULT._curve;
      return this;
    }
    this._curve = value;
    return this;
  }

  /**
   * OPTIONAL: Sets the order of the stack.
   *
   * @default stackOrderNone
   */
  stackOrder(stackOrder: null): this;
  stackOrder(
    stackOrder: (
      series: Series<
        [ContinuousValue, InternMap<CategoricalDomain, number>],
        CategoricalDomain
      >
    ) => Iterable<number>
  ): this;
  stackOrder(
    stackOrder:
      | ((
          series: Series<
            [ContinuousValue, InternMap<CategoricalDomain, number>],
            CategoricalDomain
          >
        ) => Iterable<number>)
      | null
  ): this {
    if (stackOrder === null) {
      this._stackOrder = DEFAULT._stackOrder;
      return this;
    }
    this._stackOrder = stackOrder;
    return this;
  }

  /**
   * OPTIONAL. Sets the offset of the stack.
   *
   * @default stackOffsetNone
   */
  stackOffset(stackOffset: null): this;
  stackOffset(
    stackOffset: (
      series: Series<
        [ContinuousValue, InternMap<CategoricalDomain, number>],
        CategoricalDomain
      >,
      order: number[]
    ) => void
  ): this;
  stackOffset(
    stackOffset:
      | ((
          series: Series<
            [ContinuousValue, InternMap<CategoricalDomain, number>],
            CategoricalDomain
          >,
          order: number[]
        ) => void)
      | null
  ): this {
    if (stackOffset === null) {
      this._stackOffset = DEFAULT._stackOffset;
      return this;
    }
    this._stackOffset = stackOffset;
    return this;
  }

  /**
   * REQUIRED. Sets the x dimension for the stacked area chart when using Date data.
   */
  xDate(x: null): this;
  xDate(x: (x: DateChartPositionDimensionBuilder<Datum>) => void): this;
  xDate(
    x: ((x: DateChartPositionDimensionBuilder<Datum>) => void) | null
  ): this {
    if (x === null) return this;
    this.xDimensionBuilder = new DateChartPositionDimensionBuilder<Datum>();
    x(this.xDimensionBuilder);
    return this;
  }

  /**
   * REQUIRED. Sets the x dimension for the stacked area chart when using numeric data.
   */
  xNumeric(x: null): this;
  xNumeric(x: (x: NumberChartPositionDimensionBuilder<Datum>) => void): this;
  xNumeric(
    x: ((x: NumberChartPositionDimensionBuilder<Datum>) => void) | null
  ): this {
    // do not reset the xDimensionBuilder if null is passed. if xNumeric is not called, then xDate will be called
    // allow for
    // .xNumber((x) => condition ? x.stuff() : null)
    // .xDate((x) => !condition ? x.stuff() : null)
    if (x === null) return this;
    this.xDimensionBuilder = new NumberChartPositionDimensionBuilder<Datum>();
    x(this.xDimensionBuilder);
    return this;
  }

  /**
   * REQUIRED. Sets the y dimension for the stacked area chart.
   */
  y(y: (y: NumberChartPositionDimensionBuilder<Datum>) => void): this {
    this.yDimensionBuilder = new NumberChartPositionDimensionBuilder<Datum>();
    y(this.yDimensionBuilder);
    return this;
  }

  /**
   * REQUIRED. Builds the configuration object for the stacked area chart.
   */
  getConfig(): StackedAreaConfig<Datum, CategoricalDomain> {
    this.validateBuilder();
    return new StackedAreaConfig({
      marksClass: 'vic-stacked-area',
      color: this.colorDimensionBuilder._build('Color'),
      categoricalOrder: this._categoricalOrder,
      curve: this._curve,
      data: this._data,
      datumClass: this._datumClass,
      mixBlendMode: this._mixBlendMode,
      stackOrder: this._stackOrder,
      stackOffset: this._stackOffset,
      x: this.xDimensionBuilder._build('X'),
      y: this.yDimensionBuilder._build('Y'),
    });
  }

  protected override validateBuilder(): void {
    super.validateBuilder('Stacked Area');
    if (!this.colorDimensionBuilder) {
      throw new Error(
        'Stacked Area Builder: Color dimension must be created. Please use method `color` to set the categorical dimension.'
      );
    }
    if (!this.xDimensionBuilder) {
      throw new Error(
        'Stacked Area Builder: X dimension must be created. Please use method `xNumeric` or `xDate` to set the x dimension.'
      );
    }
    if (!this.yDimensionBuilder) {
      throw new Error(
        'Stacked Area Builder: Y dimension must be created. Please use method `y` to set the y dimension.'
      );
    }
  }
}

import { Injectable } from '@angular/core';
import { DataValue } from '../../core/types/values';
import { OrdinalChartPositionDimensionBuilder } from '../../data-dimensions/ordinal/ordinal-chart-position/ordinal-chart-position-builder';
import { OrdinalVisualValueDimensionBuilder } from '../../data-dimensions/ordinal/ordinal-visual-value/ordinal-visual-value-builder';
import { NumberChartPositionDimensionBuilder } from '../../data-dimensions/quantitative/number-chart-position/number-chart-position-builder';
import { PrimaryMarksBuilder } from '../../marks/primary-marks/config/primary-marks-builder';
import { BarsConfig } from './bars-config';
import {
  BarsDimensions,
  HORIZONTAL_BARS_DIMENSIONS,
  VERTICAL_BARS_DIMENSIONS,
} from './bars-dimensions';
import { BarsLabelsBuilder } from './labels/bars-labels-builder';

/**
 * Builds a configuration object for a BarsComponent.
 *
 * Must be added to a providers array in or above the component that consumes it if it is injected via the constructor. (e.g. `providers: [VicBarsBuilder]` in the component decorator)
 *
 * The first generic parameter, Datum, is the type of the data that will be used to create the bars.
 *
 * The second generic parameter, TOrdinalValue, is the type of the ordinal data that will be used to position the bars.
 */
@Injectable()
export class VicBarsConfigBuilder<
  Datum,
  TOrdinalValue extends DataValue,
> extends PrimaryMarksBuilder<Datum> {
  protected dimensions: BarsDimensions;
  protected _orientation: 'horizontal' | 'vertical';
  protected categoricalDimensionBuilder: OrdinalVisualValueDimensionBuilder<
    Datum,
    string,
    string
  >;
  protected ordinalDimensionBuilder: OrdinalChartPositionDimensionBuilder<
    Datum,
    TOrdinalValue
  >;
  protected quantitativeDimensionBuilder: NumberChartPositionDimensionBuilder<Datum>;
  protected labelsBuilder: BarsLabelsBuilder<Datum>;

  constructor() {
    super();
  }

  /**
   * OPTIONAL. Creates a categorical dimension that will control the color of the bars.
   *
   * If not provided, all bars will be colored with the first color in `d3.schemeTableau10`, the default `range` for the dimension.
   */
  color(
    setProperties?: (
      dimension: OrdinalVisualValueDimensionBuilder<Datum, string, string>
    ) => void
  ): this {
    this.initCategoricalDimensionBuilder();
    setProperties?.(this.categoricalDimensionBuilder);
    return this;
  }

  private initCategoricalDimensionBuilder() {
    this.categoricalDimensionBuilder = new OrdinalVisualValueDimensionBuilder();
  }

  /**
   * REQUIRED FOR HORIZONTAL BAR CHART.
   */
  horizontal(
    setProperties: (
      dimension: HorizontalBarsDimensionsBuilder<Datum, TOrdinalValue>
    ) => void
  ): this {
    this._orientation = 'horizontal';
    this.dimensions = HORIZONTAL_BARS_DIMENSIONS;
    const builder = new HorizontalBarsDimensionsBuilder<Datum, TOrdinalValue>();
    setProperties(builder);
    this.ordinalDimensionBuilder = builder.ordinalDimensionBuilder;
    this.quantitativeDimensionBuilder = builder.quantitativeDimensionBuilder;
    return this;
  }

  /**
   * REQUIRED FOR VERTICAL BAR CHART.
   */
  vertical(
    setProperties: (
      dimension: VerticalBarsDimensionsBuilder<Datum, TOrdinalValue>
    ) => void
  ): this {
    this._orientation = 'vertical';
    this.dimensions = VERTICAL_BARS_DIMENSIONS;
    const builder = new VerticalBarsDimensionsBuilder<Datum, TOrdinalValue>();
    setProperties(builder);
    this.ordinalDimensionBuilder = builder.ordinalDimensionBuilder;
    this.quantitativeDimensionBuilder = builder.quantitativeDimensionBuilder;
    return this;
  }

  /**
   * OPTIONAL. Creates labels for the bars. If not called, no labels will be created.
   */
  labels(setProperties?: (dimension: BarsLabelsBuilder<Datum>) => void): this {
    this.labelsBuilder = new BarsLabelsBuilder<Datum>();
    setProperties?.(this.labelsBuilder);
    return this;
  }

  /**
   * REQUIRED. Validates and builds the configuration object for the bars that can be passed to BarsComponent.
   *
   * The user must call this at the end of the chain of methods to build the configuration object.
   */
  getConfig(): BarsConfig<Datum, TOrdinalValue> {
    this.validateBuilder('Bars');
    return new BarsConfig(this.dimensions, {
      color: this.categoricalDimensionBuilder._build(),
      data: this._data,
      labels: this.labelsBuilder?._build(),
      mixBlendMode: this._mixBlendMode,
      ordinal: this.ordinalDimensionBuilder._build(),
      quantitative: this.quantitativeDimensionBuilder._build(),
    });
  }

  protected override validateBuilder(componentName: string): void {
    super.validateBuilder(componentName);
    if (!this.categoricalDimensionBuilder) {
      this.initCategoricalDimensionBuilder();
    }
    if (!this._orientation) {
      // Technically we could make horizontal the default, but we want to make sure users are thinking about this.
      throw new Error(
        `${componentName} Builder: Orientation is required. Please use method 'orientation' to set orientation.`
      );
    }
    if (!this.ordinalDimensionBuilder) {
      // Note that the chart will still build if there is not ordinal dimension provided but it will not be full featured/anything we imagine users wanting, so we make this required.
      throw new Error(
        `${componentName} Builder: Ordinal dimension is required. Please use methods 'horizontal' and 'y' or 'vertical' and 'x' to create dimension.`
      );
    }
    if (!this.quantitativeDimensionBuilder) {
      throw new Error(
        `${componentName} Builder: Quantitative dimension is required. Please use methods 'horizontal' and 'x' or 'vertical' and 'y' to create dimension.`
      );
    }
  }
}

export class HorizontalBarsDimensionsBuilder<
  Datum,
  TOrdinalValue extends DataValue,
> {
  ordinalDimensionBuilder: OrdinalChartPositionDimensionBuilder<
    Datum,
    TOrdinalValue
  >;
  quantitativeDimensionBuilder: NumberChartPositionDimensionBuilder<Datum>;

  /**
   * REQUIRED. Creates a number-chart position dimension that will control aspects of the quantitative dimension of the chart.
   */
  x(
    setProperties: (
      dimension: NumberChartPositionDimensionBuilder<Datum>
    ) => void
  ): this {
    this.initQuantitativeDimensionBuilder();
    setProperties(this.quantitativeDimensionBuilder);
    return this;
  }

  private initQuantitativeDimensionBuilder() {
    this.quantitativeDimensionBuilder =
      new NumberChartPositionDimensionBuilder();
  }

  /**
   * REQUIRED. Creates an ordinal dimension that will control aspects of the ordinal dimension of the chart.
   */
  y(
    setProperties: (
      dimension: OrdinalChartPositionDimensionBuilder<Datum, TOrdinalValue>
    ) => void
  ): this {
    this.initOrdinalDimensionBuilder();
    setProperties(this.ordinalDimensionBuilder);
    return this;
  }

  private initOrdinalDimensionBuilder() {
    this.ordinalDimensionBuilder = new OrdinalChartPositionDimensionBuilder();
  }
}

export class VerticalBarsDimensionsBuilder<
  Datum,
  TOrdinalValue extends DataValue,
> {
  ordinalDimensionBuilder: OrdinalChartPositionDimensionBuilder<
    Datum,
    TOrdinalValue
  >;
  quantitativeDimensionBuilder: NumberChartPositionDimensionBuilder<Datum>;

  /**
   * REQUIRED. Creates an ordinal dimension that will control aspects of the ordinal dimension of the chart.
   */
  x(
    setProperties: (
      dimension: OrdinalChartPositionDimensionBuilder<Datum, TOrdinalValue>
    ) => void
  ): this {
    this.initOrdinalDimensionBuilder();
    setProperties(this.ordinalDimensionBuilder);
    return this;
  }

  private initOrdinalDimensionBuilder() {
    this.ordinalDimensionBuilder = new OrdinalChartPositionDimensionBuilder();
  }

  /**
   * REQUIRED. Creates a number-chart position dimension that will control aspects of the quantitative dimension of the chart.
   */
  y(
    setProperties: (
      dimension: NumberChartPositionDimensionBuilder<Datum>
    ) => void
  ): this {
    this.initQuantitativeDimensionBuilder();
    setProperties(this.quantitativeDimensionBuilder);
    return this;
  }

  private initQuantitativeDimensionBuilder() {
    this.quantitativeDimensionBuilder =
      new NumberChartPositionDimensionBuilder();
  }
}

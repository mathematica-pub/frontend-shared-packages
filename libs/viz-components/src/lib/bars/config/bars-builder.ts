import { Injectable } from '@angular/core';
import { DataValue } from '../../core/types/values';
import { FillDefinition } from '../../data-dimensions';
import { NumberChartPositionDimensionBuilder } from '../../data-dimensions/continuous-quantitative/number-chart-position/number-chart-position-builder';
import { OrdinalChartPositionDimensionBuilder } from '../../data-dimensions/ordinal/ordinal-chart-position/ordinal-chart-position-builder';
import { OrdinalVisualValueDimensionBuilder } from '../../data-dimensions/ordinal/ordinal-visual-value/ordinal-visual-value-builder';
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
  OrdinalDomain extends DataValue,
> extends PrimaryMarksBuilder<Datum> {
  protected _customFills: FillDefinition<Datum>[];
  protected dimensions: BarsDimensions;
  protected _orientation: 'horizontal' | 'vertical';
  protected colorDimensionBuilder: OrdinalVisualValueDimensionBuilder<
    Datum,
    string,
    string
  >;
  protected ordinalDimensionBuilder: OrdinalChartPositionDimensionBuilder<
    Datum,
    OrdinalDomain
  >;
  protected quantitativeDimensionBuilder: NumberChartPositionDimensionBuilder<Datum>;
  protected labelsBuilder: BarsLabelsBuilder<Datum>;

  constructor() {
    super();
  }

  /**
   * OPTIONAL. Creates a dimension that will control the color of the bars.
   *
   * If not provided, all bars will be colored with the first color in `d3.schemeTableau10`, the default `range` for the dimension.
   */
  color(color: null): this;
  color(
    color: (
      color: OrdinalVisualValueDimensionBuilder<Datum, string, string>
    ) => void
  ): this;
  color(
    color:
      | ((
          color: OrdinalVisualValueDimensionBuilder<Datum, string, string>
        ) => void)
      | null
  ): this {
    if (color === null) {
      this.colorDimensionBuilder = undefined;
      return this;
    }
    this.initColorDimensionBuilder();
    color(this.colorDimensionBuilder);
    return this;
  }

  private initColorDimensionBuilder() {
    this.colorDimensionBuilder = new OrdinalVisualValueDimensionBuilder();
  }

  /**
   * OPTIONAL. Sets custom fills for the bars. Intended to be users with a user-provided fill in <defs> that can be referenced here.
   *
   * Will override any fill color set by the color dimension.
   */
  customFills(customFills: FillDefinition<Datum>[]): this {
    this._customFills = customFills;
    return this;
  }

  /**
   * REQUIRED FOR HORIZONTAL BAR CHART.
   */
  horizontal(bars: null): this;
  horizontal(
    bars: (bars: HorizontalBarsDimensionsBuilder<Datum, OrdinalDomain>) => void
  ): this;
  horizontal(
    bars:
      | ((bars: HorizontalBarsDimensionsBuilder<Datum, OrdinalDomain>) => void)
      | null
  ): this {
    // Do not reset anything if null is passed, as vertical will set properties if no horizontal is provided.
    // allow for
    // .horizontal(bars => condition ? bars.stuff() : null)
    // .vertical(bars => !condition ? bars.stuff() : null)
    if (bars === null) return this;
    this._orientation = 'horizontal';
    this.dimensions = HORIZONTAL_BARS_DIMENSIONS;
    const builder = new HorizontalBarsDimensionsBuilder<Datum, OrdinalDomain>();
    bars(builder);
    this.ordinalDimensionBuilder = builder.ordinalDimensionBuilder;
    this.quantitativeDimensionBuilder = builder.quantitativeDimensionBuilder;
    return this;
  }

  /**
   * REQUIRED FOR VERTICAL BAR CHART.
   */
  vertical(bars: null): this;
  vertical(
    bars: (bars: VerticalBarsDimensionsBuilder<Datum, OrdinalDomain>) => void
  ): this;
  vertical(
    bars:
      | ((bars: VerticalBarsDimensionsBuilder<Datum, OrdinalDomain>) => void)
      | null
  ): this {
    if (bars === null) return this;
    this._orientation = 'vertical';
    this.dimensions = VERTICAL_BARS_DIMENSIONS;
    const builder = new VerticalBarsDimensionsBuilder<Datum, OrdinalDomain>();
    bars(builder);
    this.ordinalDimensionBuilder = builder.ordinalDimensionBuilder;
    this.quantitativeDimensionBuilder = builder.quantitativeDimensionBuilder;
    return this;
  }

  /**
   * OPTIONAL. Creates labels for the bars. If not called, no labels will be created.
   */
  labels(labels: null): this;
  labels(labels: (labels: BarsLabelsBuilder<Datum>) => void): this;
  labels(labels: ((labels: BarsLabelsBuilder<Datum>) => void) | null): this {
    if (labels === null) {
      this.labelsBuilder = undefined;
      return this;
    }
    this.labelsBuilder = new BarsLabelsBuilder<Datum>();
    labels(this.labelsBuilder);
    return this;
  }

  /**
   * REQUIRED. Validates and builds the configuration object for the bars that can be passed to BarsComponent.
   *
   * The user must call this at the end of the chain of methods to build the configuration object.
   */
  getConfig(): BarsConfig<Datum, OrdinalDomain> {
    this.validateBuilder('Bars');
    return new BarsConfig(this.dimensions, {
      color: this.colorDimensionBuilder._build('Color'),
      customFills: this._customFills,
      data: this._data,
      labels: this.labelsBuilder?._build(),
      mixBlendMode: this._mixBlendMode,
      ordinal: this.ordinalDimensionBuilder._build(
        'band',
        this.getOrdinalDimensionName()
      ),
      quantitative: this.quantitativeDimensionBuilder._build(
        this.getQuantitativeDimensionName()
      ),
    });
  }

  protected override validateBuilder(componentName: string): void {
    super.validateBuilder(componentName);
    if (!this.colorDimensionBuilder) {
      this.initColorDimensionBuilder();
    }
    if (!this._orientation) {
      // Technically we could make horizontal the default, but we want to make sure users are thinking about this.
      throw new Error(
        `${componentName} Builder: Orientation is required. Please use method 'horizontal' or 'vertical' to set orientation.`
      );
    }
    if (!this.ordinalDimensionBuilder) {
      // Note that the chart will still build if there is not ordinal dimension provided but it will not be full featured/anything we imagine users wanting, so we make this required.
      const dimension = this.getOrdinalDimensionName();
      throw new Error(
        `${componentName} Builder: ${dimension} dimension is required. Please use ${dimension.toLowerCase()} method to create dimension.`
      );
    }
    if (!this.quantitativeDimensionBuilder) {
      const dimension = this.getQuantitativeDimensionName();
      throw new Error(
        `${componentName} Builder: ${dimension} dimension is required. Please use ${dimension.toLowerCase()} method to create dimension.`
      );
    }
  }

  protected getOrdinalDimensionName(): string {
    return this._orientation === 'horizontal' ? 'Y' : 'X';
  }

  protected getQuantitativeDimensionName(): string {
    return this._orientation === 'horizontal' ? 'X' : 'Y';
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

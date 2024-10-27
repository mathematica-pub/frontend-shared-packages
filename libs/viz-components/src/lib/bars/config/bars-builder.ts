import { Injectable } from '@angular/core';
import { DataValue } from '../../core/types/values';
import { CategoricalDimensionBuilder } from '../../data-dimensions/categorical/categorical-builder';
import { OrdinalDimensionBuilder } from '../../data-dimensions/ordinal/ordinal-builder';
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
  protected categoricalDimensionBuilder: CategoricalDimensionBuilder<Datum>;
  protected ordinalDimensionBuilder: OrdinalDimensionBuilder<
    Datum,
    TOrdinalValue
  >;
  protected quantitativeDimensionBuilder: NumberChartPositionDimensionBuilder<Datum>;
  protected labelsBuilder: BarsLabelsBuilder<Datum>;

  constructor() {
    super();
  }

  /**
   * OPTIONAL. Creates a categorical dimension that will control the coloring of the bars.
   *
   * If not provided, all bars will be colored with the first color in `d3.schemeTableau10`, the default `range` for the dimension.
   */
  createCategoricalDimension(
    setProperties?: (dimension: CategoricalDimensionBuilder<Datum>) => void
  ): this {
    this.initCategoricalDimensionBuilder();
    setProperties?.(this.categoricalDimensionBuilder);
    return this;
  }

  private initCategoricalDimensionBuilder() {
    this.categoricalDimensionBuilder = new CategoricalDimensionBuilder();
  }

  /**
   * REQUIRED. Creates an ordinal dimension that will control the position of the bars.
   */
  createOrdinalDimension(
    setProperties?: (
      dimension: OrdinalDimensionBuilder<Datum, TOrdinalValue>
    ) => void
  ): this {
    this.initOrdinalDimensionBuilder();
    setProperties?.(this.ordinalDimensionBuilder);
    return this;
  }

  private initOrdinalDimensionBuilder() {
    this.ordinalDimensionBuilder = new OrdinalDimensionBuilder();
  }

  /**
   * REQUIRED. Sets the orientation of the bars.
   */
  orientation(orientation: 'horizontal' | 'vertical'): this {
    this._orientation = orientation;
    this.dimensions =
      orientation === 'horizontal'
        ? HORIZONTAL_BARS_DIMENSIONS
        : VERTICAL_BARS_DIMENSIONS;
    return this;
  }

  /**
   * REQUIRED. Creates a quantitative dimension that will control the data-driven size of the bars.
   */
  createQuantitativeDimension(
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
   * OPTIONAL. Creates labels for the bars. If not called, no labels will be created.
   */
  createLabels(
    setProperties?: (dimension: BarsLabelsBuilder<Datum>) => void
  ): this {
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
      categorical: this.categoricalDimensionBuilder._build(),
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
        `${componentName} Builder: Ordinal dimension is required. Please use method 'createOrdinalDimension' to create dimension.`
      );
    }
    if (!this.quantitativeDimensionBuilder) {
      throw new Error(
        `${componentName} Builder: Quantitative dimension is required. Please use method 'createQuantitativeDimension' to create dimension.`
      );
    }
  }
}

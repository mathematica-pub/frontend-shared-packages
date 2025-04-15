import { Injectable } from '@angular/core';
import { DataValue } from '../../core/types/values';
import { FillDefinition } from '../../data-dimensions';
import { NumberChartPositionDimensionBuilder } from '../../data-dimensions/continuous-quantitative/number-chart-position/number-chart-position-builder';
import { OrdinalChartPositionDimensionBuilder } from '../../data-dimensions/ordinal/ordinal-chart-position/ordinal-chart-position-builder';
import { OrdinalVisualValueDimensionBuilder } from '../../data-dimensions/ordinal/ordinal-visual-value/ordinal-visual-value-builder';
import { PrimaryMarksBuilder } from '../../marks/primary-marks/config/primary-marks-builder';
import { BarsBackgroundsBuilder } from './backgrounds/bars-backgrounds-builder';
import { BarsConfig } from './bars-config';
import {
  BarsDimensions,
  HORIZONTAL_BARS_DIMENSIONS,
  VERTICAL_BARS_DIMENSIONS,
} from './bars-dimensions';
import { BarsLabelsBuilder } from './labels/bars-labels-builder';

abstract class BaseDimensionsBuilder<Datum, TOrdinalValue extends DataValue> {
  protected _ordinalDimensionBuilder: OrdinalChartPositionDimensionBuilder<
    Datum,
    TOrdinalValue
  >;
  protected _quantitativeDimensionBuilder: NumberChartPositionDimensionBuilder<Datum>;

  // Getter methods for VicBarsConfigBuilder to access the builders
  get ordinalDimensionBuilder() {
    return this._ordinalDimensionBuilder;
  }

  get quantitativeDimensionBuilder() {
    return this._quantitativeDimensionBuilder;
  }

  protected initOrdinalDimensionBuilder() {
    this._ordinalDimensionBuilder = new OrdinalChartPositionDimensionBuilder();
  }

  protected initQuantitativeDimensionBuilder() {
    this._quantitativeDimensionBuilder =
      new NumberChartPositionDimensionBuilder();
  }
}

export class HorizontalBarsDimensionsBuilder<
  Datum,
  TOrdinalValue extends DataValue,
> extends BaseDimensionsBuilder<Datum, TOrdinalValue> {
  /**
   * REQUIRED. Specifies how values derived from `Datum` (of type `number`) set the x domain of the chart, and how those values are displayed.
   *
   * @param x - A function that specifies how the quantitative values that are mapped to the x dimension will be used in the chart.
   */
  x(x: (x: NumberChartPositionDimensionBuilder<Datum>) => void): this {
    this.initQuantitativeDimensionBuilder();
    x(this._quantitativeDimensionBuilder);
    return this;
  }

  /**
   * REQUIRED. Specifies how values derived from `Datum` (may be type `string`, `number`, or `Date`, though typically `string`) set the y domain of the chart, and how those values are displayed.
   *
   * @param y - A function that specifies how ordinal/categorical values that are mapped to the y dimension will be used in the chart.
   */
  y(
    y: (y: OrdinalChartPositionDimensionBuilder<Datum, TOrdinalValue>) => void
  ): this {
    this.initOrdinalDimensionBuilder();
    y(this._ordinalDimensionBuilder);
    return this;
  }
}

export class VerticalBarsDimensionsBuilder<
  Datum,
  TOrdinalValue extends DataValue,
> extends BaseDimensionsBuilder<Datum, TOrdinalValue> {
  /**
   * REQUIRED. Specifies how values derived from `Datum` (may be type `string`, `number`, or `Date`, though typically `string`) set the x domain of the chart, and how those values are displayed.
   *
   * @param x - A function that specifies how ordinal/categorical values that are mapped to the x dimension will be used in the chart.
   */
  x(
    x: (x: OrdinalChartPositionDimensionBuilder<Datum, TOrdinalValue>) => void
  ): this {
    this.initOrdinalDimensionBuilder();
    x(this._ordinalDimensionBuilder);
    return this;
  }

  /**
   * REQUIRED. Specifies how values derived from `Datum` (of type `number`) set the y domain of the chart, and how those values are displayed.
   *
   * @param y - A function that specifies how the quantitative values that are mapped to the y dimension will be used in the chart.
   */
  y(y: (y: NumberChartPositionDimensionBuilder<Datum>) => void): this {
    this.initQuantitativeDimensionBuilder();
    y(this._quantitativeDimensionBuilder);
    return this;
  }
}

/**
 * Builds a configuration object for a BarsComponent.
 *
 * Must be added to a providers array in or above the component that consumes it if it is injected via the constructor. (e.g. `providers: [VicBarsConfigBuilder]` in the component decorator)
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
  protected backgroundsBuilder: BarsBackgroundsBuilder;
  protected colorDimensionBuilder: OrdinalVisualValueDimensionBuilder<
    Datum,
    string,
    string
  >;
  protected labelsBuilder: BarsLabelsBuilder<Datum>;
  protected ordinalDimensionBuilder: OrdinalChartPositionDimensionBuilder<
    Datum,
    OrdinalDomain
  >;
  protected quantitativeDimensionBuilder: NumberChartPositionDimensionBuilder<Datum>;

  constructor() {
    super();
  }

  /**
   * OPTIONAL. Specifies properties of bars to be drawn behind the bars that represent data values. The background bars span the full width of the chart.
   *
   * @param backgrounds - A function that specifies the color of background bars and whether they respond to events, or `null` to unset the backgrounds function.
   *
   * If called with no arguments, the default background will be `whitesmoke` and events will be `false`.
   *
   * If not called, no background bars will be created.
   */
  backgrounds(backgrounds: (backgrounds: BarsBackgroundsBuilder) => void): this;
  backgrounds(): this;
  backgrounds(backgrounds: null): this;
  backgrounds(
    backgrounds: ((backgrounds: BarsBackgroundsBuilder) => void) | null | void
  ): this {
    if (backgrounds === null) {
      this.backgroundsBuilder = undefined;
      return this;
    }
    this.backgroundsBuilder = new BarsBackgroundsBuilder();
    if (backgrounds) {
      backgrounds?.(this.backgroundsBuilder);
    }
    return this;
  }

  /**
   * OPTIONAL. Specifies how values derived from `Datum` (of type `string`) set the color of the bars, and how those values are displayed.
   *
   * @param color - A function that specifies how values derived from `Datum` will be used to set the color of the bars, or null to unset the color., or null to unset the color function.
   *
   * If not called, all bars will be colored with the first color in `d3.schemeTableau10`, the default `range` color scale.
   */
  color(
    color: (
      color: OrdinalVisualValueDimensionBuilder<Datum, string, string>
    ) => void
  ): this;
  color(color: null): this;
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
    color?.(this.colorDimensionBuilder);
    return this;
  }

  private initColorDimensionBuilder() {
    this.colorDimensionBuilder = new OrdinalVisualValueDimensionBuilder();
  }

  /**
   * OPTIONAL. Determines custom fills for specified bars. Intended to be used with a user-provided fill in <defs> (provided in html) whose `id` is referenced here. The `shouldApply` function is used to determine whether the fill should be applied to a given datum.
   *
   * @param values - An array of custom fills ({ defId: string; shouldApply: (d: Datum) => boolean;}[]), or `null` to unset the custom fills.
   *
   * This will override any fill set by the `color` dimension.
   */
  customFills(values: FillDefinition<Datum>[] | null): this {
    if (values === null) {
      this._customFills = undefined;
      return this;
    }
    this._customFills = values;
    return this;
  }

  /**
   * REQUIRED FOR HORIZONTAL BAR CHART.
   *
   * @param bars - A function that specifies properties for the horizontal bars, or `null` to not set the horizontal orientation.
   */
  horizontal(
    bars: (bars: HorizontalBarsDimensionsBuilder<Datum, OrdinalDomain>) => void
  ): this;
  horizontal(bars: null): this;
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
   * OPTIONAL. Specifies properties of labels to be rendered at the end of bars, typically used to show bar values.
   *
   * @param labels - A function that specifies properties for the labels, or `null` to unset the labels.
   *
   * If not called, no labels will be created.
   */
  labels(labels: (labels: BarsLabelsBuilder<Datum>) => void): this;
  labels(labels: null): this;
  labels(labels: ((labels: BarsLabelsBuilder<Datum>) => void) | null): this {
    if (labels === null) {
      this.labelsBuilder = undefined;
      return this;
    }
    this.labelsBuilder = new BarsLabelsBuilder<Datum>();
    labels?.(this.labelsBuilder);
    return this;
  }

  /**
   * REQUIRED FOR VERTICAL BAR CHART.
   *
   * @param bars - A function that specifies properties for the vertical bars, or `null` to not set the vertical orientation.
   */
  vertical(
    bars: (bars: VerticalBarsDimensionsBuilder<Datum, OrdinalDomain>) => void
  ): this;
  vertical(bars: null): this;
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
   * REQUIRED. Validates and builds the configuration object for the bars that can be passed to BarsComponent.
   *
   * The user must call this at the end of the chain of methods to build the configuration object.
   */
  getConfig(): BarsConfig<Datum, OrdinalDomain> {
    this.validateBuilder('Bars');
    return new BarsConfig(this.dimensions, {
      marksClass: 'vic-bars',
      backgrounds: this.backgroundsBuilder?._build(),
      color: this.colorDimensionBuilder._build('Color'),
      customFills: this._customFills,
      data: this._data,
      datumClass: this._class,
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

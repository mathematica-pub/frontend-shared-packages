import { safeAssign } from '@hsi/app-dev-kit';
import { AxisTimeInterval } from 'd3';
import { TickWrapBuilder } from './tick-wrap/tick-wrap-builder';
import { QuantitativeTicks, Ticks } from './ticks';

export interface AxisSpecificTickBuilderOptions {
  _sizeOuter: number;
}

export interface AxisSpecificQuantitativeTickBuilderOptions<Tick>
  extends AxisSpecificTickBuilderOptions {
  _format: string | ((value: Tick) => string);
}

const DEFAULT = {
  _display: true,
  _remove: false,
  _stroke: 'none',
  _strokeOpacity: 1,
  _strokeWidth: 3,
};

const QUANT_DEFAULT = {
  _spacing: 40,
};

export class TicksBuilder<Tick> {
  protected _fontSize: number;
  protected _format: string | ((value: Tick) => string);
  protected _labelsDisplay: boolean;
  protected _rotate: number;
  protected _labelsStroke: string;
  protected _labelsStrokeOpacity: number;
  protected _labelsStrokeWidth: number;
  protected _size: number;
  protected _sizeInner: number;
  protected _sizeOuter: number;
  protected wrapBuilder: TickWrapBuilder;

  constructor(options: Partial<AxisSpecificTickBuilderOptions>) {
    safeAssign(this, DEFAULT);
    safeAssign(this, options);
  }

  /**
   * OPTIONAL. Sets the font size of the tick labels.
   *
   * @param value - The font size of the tick labels, in px.
   *
   * If not called, the default font size is D3's default, which is 10px.
   */
  fontSize(value: number | null): this {
    if (value === null) {
      this._fontSize = undefined;
      return this;
    }
    this._fontSize = value;
    return this;
  }

  /**
   * OPTIONAL. Specifies how tick labels will be formatted. The format can be a string or a function.
   *
   * @param value - Either a D3 format string, a function that takes a value and returns a string, or `null` to unset the format.
   *
   * If not called, the default value for quantitative axes is ',.1f'. If not called for an ordinal axis, tick labels will be the unformatted ordinal value.
   */
  format(format: string): this;
  format(format: (value: Tick) => string): this;
  format(format: null): this;
  format(format: string | ((value: Tick) => string) | null): this {
    if (format === null) {
      this._format = undefined;
      return this;
    }
    this._format = format;
    return this;
  }

  /**
   * OPTIONAL. If false, tick labels will be removed.
   *
   * @param value - `true` to retain all tick labels, `false` to remove all tick labels.
   *
   * If not called, the default value is `true`.
   */
  labelsDisplay(value: boolean): this {
    this._labelsDisplay = value;
    return this;
  }

  /**
   * OPTIONAL. Sets the color of the stroke around the tick labels. Often used to improve the legibility of tick labels, for example, on dark backgrounds.
   *
   * @param value - The stroke of the tick labels.
   *
   * If not called, the default value is 'none'.
   */
  labelsStroke(value: string | null): this {
    if (value === null) {
      this._labelsStroke = DEFAULT._stroke;
      return this;
    }
    this._labelsStroke = value;
    return this;
  }

  /**
   * OPTIONAL. Sets the opacity of the stroke applied around the tick labels.
   *
   * @param value - The opacity of the stroke around the tick labels.
   *
   * If not called, the default value is 1.
   */
  labelsStrokeOpacity(value: number | null): this {
    if (value === null) {
      this._labelsStrokeOpacity = undefined;
      return this;
    }
    this._labelsStrokeOpacity = value;
    return this;
  }

  /**
   * OPTIONAL. Sets the width of the stroke around the tick labels. Often used to improve the legibility of tick labels, for example, on dark backgrounds.
   *
   * @param value - The width of the stroke around the tick labels.
   *
   * If not called, the default value is 3.
   */
  labelsStrokeWidth(value: number | null): this {
    if (value === null) {
      this._labelsStrokeWidth = undefined;
      return this;
    }
    this._labelsStrokeWidth = value;
    return this;
  }

  /**
   * OPTIONAL. Determines the rotation of tick labels.
   *
   * @param value - The rotation of the tick labels in degrees, or `null` to unset the rotation.
   *
   * Positive values rotate clockwise, negative values rotate counterclockwise.
   *
   * If not called, ticks will not be rotated.
   */

  rotate(value: number | null): this {
    if (value === null) {
      this._rotate = undefined;
      return this;
    }
    this._rotate = value;
    return this;
  }

  /**
   * OPTIONAL. Sets the size of inner and outer tick marks. To show no tick marks, set the size to 0.
   *
   * @param value - The size of the ticks, in px.
   *
   * If not called or called with `null`, the default size is the D3 default size.
   *
   * If specified, this value will override any values set by `sizeInner` or `sizeOuter`.
   */
  size(value: number | null): this {
    if (value === null) {
      this._size = undefined;
      return this;
    }
    this._size = value;
    return this;
  }

  /**
   * OPTIONAL. Determines the length of the inner ticks drawn by D3. Does not apply to the outermost ticks.
   *
   * @param value - The length of the inner ticks in pixels, or `null` to unset the value.
   *
   * If not called or called with `null`, the default value is the D3 default size.
   *
   */
  sizeInner(value: number | null): this {
    if (value === null) {
      this._sizeInner = undefined;
      return this;
    }
    this._sizeInner = value;
    return this;
  }

  /**
   * OPTIONAL. Determines the length of the square ends of the domain path drawn by D3.
   *
   * @param value - The length of the square ends of the domain path in pixels, or `null` to unset the value.
   *
   * If not called on ordinal axes, the default value is 0. If not called on quantitative axes, no modification is made to D3's default value.
   */
  sizeOuter(value: number | null): this {
    if (value === null) {
      this._sizeOuter = undefined;
      return this;
    }
    this._sizeOuter = value;
    return this;
  }

  /**
   * OPTIONAL. Specifies how tick labels will be wrapped.
   *
   * @param wrap - A callback that specifies how tick labels will be wrapped, or `null` to unset the wrapping.
   *
   * If not called, the tick labels will not be wrapped.
   */
  wrap(wrap: (wrap: TickWrapBuilder) => void): this;
  wrap(wrap: null): this;
  wrap(wrap: (wrap: TickWrapBuilder) => void | null): this {
    if (wrap === null) {
      this.wrapBuilder = undefined;
      return this;
    }
    this.wrapBuilder = new TickWrapBuilder();
    wrap(this.wrapBuilder);
    return this;
  }

  _build(dimension: 'x' | 'y'): Ticks<Tick> {
    return new Ticks({
      fontSize: this._fontSize,
      format: this._format,
      labelsDisplay: this._labelsDisplay,
      labelsStroke: this._labelsStroke,
      labelsStrokeOpacity: this._labelsStrokeOpacity,
      labelsStrokeWidth: this._labelsStrokeWidth,
      rotate: this._rotate,
      size: this._size,
      sizeInner: this._sizeInner,
      sizeOuter: this._sizeOuter,
      wrap: this.wrapBuilder?._build(dimension),
    });
  }
}

export class QuantitativeTicksBuilder<Tick> extends TicksBuilder<Tick> {
  private _count: number | AxisTimeInterval;
  private _spacing: number;
  private _values: Tick[];

  constructor(
    options: Partial<AxisSpecificQuantitativeTickBuilderOptions<Tick>>
  ) {
    super(options);
    safeAssign(this, DEFAULT);
    safeAssign(this, QUANT_DEFAULT);
  }

  /**
   * OPTIONAL. Approximately specifies the number of ticks for the axis.
   *
   * @param value - The number of ticks to pass to D3's axis.ticks(), or null to unset the number of ticks.
   *
   * If not called, a reasonable and valid default will be used based on the size of the chart.
   *
   * Note that this number will be passed to D3's `ticks()` method and therefore it can be an approximate number of ticks.
   *
   * If this method is called, the passed in number of ticks will be validated against the data domain and the value formatter for the axis. If the number of ticks is not valid—for example, if the ticks are formatted with %Y and there are three years of values in the data, and this method is called with 10, a valid number will be used instead.
   */
  count(value: number | AxisTimeInterval | null): this {
    if (value === null) {
      this._count = undefined;
      return this;
    }
    this._count = value;
    return this;
  }

  /**
   * OPTIONAL. Specifies the an approximate spacing between ticks, in pixels.
   *
   * @param value - The spacing between ticks in pixels, or null to unset the spacing.
   *
   * If not called, the default value is 40. If `count` is set, this value will be ignored.
   */
  spacing(value: number | null): this {
    if (value === null) {
      this._spacing = undefined;
      return this;
    }
    this._spacing = value;
    return this;
  }

  /**
   * OPTIONAL. Determines the values that will show up as ticks on the axis.
   *
   * @param values - An array of quantitative values to pass to D3's axis.tickValues(), or null to unset the tick values.
   *
   */
  values(values: Tick[] | null): this {
    if (values === null) {
      this._values = undefined;
      return this;
    }
    this._values = values;
    return this;
  }

  override _build(dimension: 'x' | 'y'): QuantitativeTicks<Tick> {
    return new QuantitativeTicks({
      fontSize: this._fontSize,
      format: this._format,
      labelsDisplay: this._labelsDisplay,
      labelsStroke: this._labelsStroke,
      labelsStrokeOpacity: this._labelsStrokeOpacity,
      labelsStrokeWidth: this._labelsStrokeWidth,
      count: this._count,
      rotate: this._rotate,
      size: this._size,
      sizeInner: this._sizeInner,
      sizeOuter: this._sizeOuter,
      spacing: this._spacing,
      values: this._values,
      wrap: this.wrapBuilder?._build(dimension),
    });
  }
}

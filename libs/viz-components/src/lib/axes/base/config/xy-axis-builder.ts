import { VicAuxMarksBuilder } from '../../../marks';
import { AxisLabelBuilder } from '../../axis-label/axis-label-builder';
import { GridBuilder } from '../../grid/grid-builder';
import { TickWrapBuilder } from '../../tick-wrap/tick-wrap-builder';

export abstract class XyAxisBaseBuilder<
  TickValue,
> extends VicAuxMarksBuilder<void> {
  protected _axis: 'x' | 'y';
  protected _dimension: 'ordinal' | 'quantitative';
  protected _removeDomainLine: boolean;
  protected _removeTickLabels: boolean;
  protected _removeTickMarks: boolean;
  protected _rotateTickLabels: number;
  protected _tickFormat: string | ((value: TickValue) => string);
  protected _tickLabelFontSize: number;
  protected _tickSizeOuter: number;
  protected _zeroAxis: {
    strokeDasharray: string | null;
    useZeroAxis: boolean;
  };
  protected tickWrapBuilder: TickWrapBuilder;
  protected gridBuilder: GridBuilder;
  protected labelBuilder: AxisLabelBuilder;
  protected marksClass: string;

  /**
   * OPTIONAL. Specifies the configuration of grid lines for the axis. Grid lines are the lines that run perpendicular to the axis and intersect with tick marks.
   *
   * @param grid - A callback that specifies properties for the grid lines, or `null` to unset the grid.
   *
   * If called with no argument, the default values of the grid will be used.
   */
  grid(grid: (grid: GridBuilder) => void): this;
  grid(): this;
  grid(grid: null): this;
  grid(grid?: ((grid: GridBuilder) => void) | null): this {
    if (grid === null) {
      this.gridBuilder = undefined;
      return this;
    }
    this.gridBuilder = new GridBuilder();
    grid?.(this.gridBuilder);
    return this;
  }

  /**
   * OPTIONAL. Specifies properties for an axis label.
   *
   * @param label - A callback that specifies properties for an axis label, or `null` to unset the label.
   */
  label(label: (label: AxisLabelBuilder) => void): this;
  label(label: null): this;
  label(label: ((label: AxisLabelBuilder) => void) | null): this {
    if (label === null) {
      this.labelBuilder = undefined;
      return this;
    }
    this.labelBuilder = new AxisLabelBuilder();
    label(this.labelBuilder);
    return this;
  }

  /**
   * OPTIONAL. Determines whether the axis domain line will be removed.
   *
   * @param value - boolean
   *
   * If true, the domain line will be removed. If false, the domain line will be retained.
   *
   * If called with no argument, the default value is `true`.
   *
   * If not called, the default value is `false` for quantitative axes and `true` for ordinal axes.
   */
  removeDomainLine(value: boolean = true): this {
    this._removeDomainLine = value;
    return this;
  }

  /**
   * OPTIONAL. Determines whether tick labels (`SVGTextElement`s) will be removed from the axis.
   *
   * @param value - `true` to remove all tick labels, `false` to retain all tick labels.
   *
   * If called with no argument, the default value is `true`.
   *
   * If not called, the default value is `false`.
   */
  removeTickLabels(value: boolean = true): this {
    this._removeTickLabels = value;
    return this;
  }

  /**
   * OPTIONAL. Determines whether tick marks (`SVGLineElement`s) will be removed from the axis.
   *
   * @param value - `true` to remove all tick marks, `false` to retain all tick marks.
   *
   * If called with no argument, the default value is `true`.
   *
   * If not called, the default value is `false`.
   */
  removeTickMarks(value: boolean = true): this {
    this._removeTickMarks = value;
    return this;
  }

  /**
   * OPTIONAL. Determines the rotation of tick labels.
   *
   * @param value - The rotation of the tick labels in degrees, or `null` to unset the rotation. Positive values will rotate the labels counterclockwise.
   *
   * If not called, ticks will not be rotated.
   */

  rotateTickLabels(value: number | null): this {
    if (value === null) {
      this._rotateTickLabels = undefined;
      return this;
    }
    this._rotateTickLabels = value;
    return this;
  }

  /**
   * OPTIONAL. Specifies how tick labels will be formatted. The format can be a string or a function.
   *
   * @param value - Either a D3 format string, a function that takes a value and returns a string, or `null` to unset the format.
   *
   * If not called, the default value for quantitative axes is ',.1f'. If not called for an ordinal axis, tick labels will be the unformatted ordinal value.
   */
  tickFormat(tickFormat: string): this;
  tickFormat(tickFormat: (value: TickValue) => string): this;
  tickFormat(tickFormat: null): this;
  tickFormat(tickFormat: string | ((value: TickValue) => string) | null): this {
    if (tickFormat === null) {
      this._tickFormat = undefined;
      return this;
    }
    this._tickFormat = tickFormat;
    return this;
  }

  /**
   * OPTIONAL. Specifies the font size of tick and axis labels.
   *
   * @param value - The font size in px, or `null` to unset the font size.
   *
   * If not called, D3's default font size will be used.
   */
  tickLabelFontSize(value: number | null): this {
    if (value === null) {
      this._tickLabelFontSize = undefined;
      return this;
    }
    this._tickLabelFontSize = value;
    return this;
  }

  /**
   * OPTIONAL. Determines the length of the square ends of the domain path drawn by D3.
   *
   * @param value - The length of the square ends of the domain path in pixels, or `null` to unset the value.
   *
   * If not called on ordinal axes, the default value is 0. If not called on quantitative axes, no modification is made to D3's default value.
   */
  tickSizeOuter(value: number | null): this {
    if (value === null) {
      this._tickSizeOuter = undefined;
      return this;
    }
    this._tickSizeOuter = value;
    return this;
  }

  /**
   * OPTIONAL. Specifies how tick labels will be wrapped.
   *
   * @param wrap - A callback that specifies how tick labels will be wrapped, or `null` to unset the wrapping.
   *
   * If not called, the tick labels will not be wrapped.
   */
  wrapTickText(wrap: (wrap: TickWrapBuilder) => void): this;
  wrapTickText(wrap: null): this;
  wrapTickText(wrap: (wrap: TickWrapBuilder) => void | null): this {
    if (wrap === null) {
      this.tickWrapBuilder = undefined;
      return this;
    }
    this.tickWrapBuilder = new TickWrapBuilder();
    wrap(this.tickWrapBuilder);
    return this;
  }

  /**
   * OPTIONAL. Determines whether an axis is drawn at the zero tick mark of the perpedicular axis when there re positive and negative values in the chart, and the stroke-dasharray of the zero axis if drawn.
   *
   * @param value - An object with two properties: `strokeDasharray` and `useZeroAxis`. `strokeDasharray` is a string that specifies the stroke-dasharray of the zero axis, and `useZeroAxis` is a boolean that determines whether the zero axis will be drawn.
   *
   * If `strokeDasharray` is `null`, the zero axis will be drawn as a solid line.
   *
   * If `useZeroAxis` is `false`, the zero axis will not be drawn, and the domain line will be drawn at the edge of the chart.
   *
   * If not called, or if called with `null`, the default value is `{ strokeDasharray: '2 2', useZeroAxis: true }`.
   */
  zeroAxis(
    value: Partial<{
      strokeDasharray: string | null;
      useZeroAxis: boolean;
    }> | null
  ): this {
    const defaultValue = { strokeDasharray: '2', useZeroAxis: true };
    if (value === null) {
      this._zeroAxis = defaultValue;
      return this;
    }
    this._zeroAxis = {
      ...defaultValue,
      ...value,
    };
    return this;
  }
}

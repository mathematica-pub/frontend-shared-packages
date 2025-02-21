import { VicAuxMarksBuilder } from '../../../marks';
import { AxisLabelBuilder } from '../../axis-label/axis-label-builder';
import { GridBuilder } from '../../grid/grid-builder';
import { TickWrapBuilder } from '../../tick-wrap/tick-wrap-builder';
import { RemoveDomain } from './xy-axis-options';

export abstract class XyAxisBaseBuilder<
  TickValue,
> extends VicAuxMarksBuilder<void> {
  protected _axis: 'x' | 'y';
  protected _dimension: 'ordinal' | 'quantitative';
  protected _removeDomainLine: RemoveDomain;
  protected _removeTickLabels: boolean;
  protected _removeTickMarks: boolean;
  protected _tickFormat: string | ((value: TickValue) => string);
  protected _tickLabelFontSize: number;
  protected _tickSizeOuter: number;
  protected _zeroAxisStroke: 'solid' | string;
  protected tickWrapBuilder: TickWrapBuilder;
  protected gridBuilder: GridBuilder;
  protected labelBuilder: AxisLabelBuilder;
  protected marksClass: string;

  /**
   * OPTIONAL. An object to configure grid lines.
   *
   * To unset the grid, call with null.
   */
  grid(): this;
  grid(grid: null): this;
  grid(grid: (grid: GridBuilder) => void): this;
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
   * To unset the label, call with null.
   */
  label(label: null): this;
  label(label: (label: AxisLabelBuilder) => void): this;
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
   * OPTIONAL. If always, the default domain line that D3 creates for the axis will be removed. If never, the line will be retained. If atChartEdge, the line will be removed if the axis is at the edge of the chart, but retained if the axis is in the middle of the chart.
   *
   * If called with no argument, the default value is 'atChartEdge'.
   */
  removeDomainLine(value: RemoveDomain = 'unlessZeroAxis'): this {
    this._removeDomainLine = value;
    return this;
  }

  /**
   * OPTIONAL. If always, all ticks (lines and tick values) will be removed.
   */
  removeTickLabels(value: boolean = true): this {
    this._removeTickLabels = value;
    return this;
  }

  /**
   * OPTIONAL. If true, all ticks will be removed. Tick values will be retained.
   *
   * Note: likely to be used with Bars ordinal axis.
   */
  removeTickMarks(value: boolean = true): this {
    this._removeTickMarks = value;
    return this;
  }

  /**
   * A string or function to use for formatting tick labels.
   *
   * If not provided on Quantitative Axes, ticks will be formatter with ',.1f'.
   *
   * If the formatter does not include a decimal point, a warning will be logged in the console and internal tick validation will be disabled.
   *
   * To unset the tick format, call with null.
   */
  tickFormat(format: null): this;
  tickFormat(format: string): this;
  tickFormat(format: (value: TickValue) => string): this;
  tickFormat(format: string | ((value: TickValue) => string) | null): this {
    if (format === null) {
      this._tickFormat = undefined;
      return this;
    }
    this._tickFormat = format;
    return this;
  }

  /**
   * A font size to apply to the tick labels, in px. If not specified, D3's default font size will be used.
   *
   * To unset the font size, call with null.
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
   * A value that is passed to D3's [tickSizeOuter]{@link https://github.com/d3/d3-axis#axis_tickSizeOuter}
   *  method.
   *
   * On ordinal axes, if not provided, value will be set to 0.
   *
   * To unset, call with null.
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
   * A config object to specify how tick labels should wrap.
   */
  wrapTickText(wrap: null): this;
  wrapTickText(wrap: (wrap: TickWrapBuilder) => void): this;
  wrapTickText(wrap: (wrap: TickWrapBuilder) => void | null): this {
    if (wrap === null) {
      this.tickWrapBuilder = undefined;
      return this;
    }
    this.tickWrapBuilder = new TickWrapBuilder();
    wrap(this.tickWrapBuilder);
    return this;
  }

  zeroAxisStroke(value: 'solid' | string): this {
    this._zeroAxisStroke = value;
    return this;
  }
}

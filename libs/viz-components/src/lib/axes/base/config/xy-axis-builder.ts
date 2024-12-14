import { VicAuxMarksBuilder } from '../../../marks';
import { AxisLabelBuilder } from '../../axis-label/axis-label-builder';
import { TickWrapBuilder } from '../../tick-wrap/tick-wrap-builder';

export abstract class XyAxisBaseBuilder<TickValue> extends VicAuxMarksBuilder {
  protected _axis: 'x' | 'y';
  protected _dimension: 'ordinal' | 'quantitative';
  protected _removeDomainLine: boolean;
  protected _removeTickLabels: boolean;
  protected _removeTickMarks: boolean;
  protected _tickFormat: string | ((value: TickValue) => string);
  protected _tickLabelFontSize: number;
  protected _tickSizeOuter: number;
  protected tickWrapBuilder: TickWrapBuilder;
  protected labelBuilder: AxisLabelBuilder;

  /**
   * Specifies properties for an axis label.
   */
  label(setProperties: (label: AxisLabelBuilder) => void): this {
    this.labelBuilder = new AxisLabelBuilder();
    setProperties(this.labelBuilder);
    return this;
  }

  /**
   * If true, the default line that D3 creates for the axis will be removed.
   */
  removeDomainLine(value: boolean = true): this {
    this._removeDomainLine = value;
    return this;
  }

  /**
   * If true, all ticks (lines and tick values) will be removed.
   */
  removeTickLabels(value: boolean = true): this {
    this._removeTickLabels = value;
    return this;
  }

  /**
   * If true, all ticks will be removed. Tick values will be retained.
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
   */
  tickFormat(value: string | ((value: TickValue) => string)): this {
    this._tickFormat = value;
    return this;
  }

  /**
   * A font size to apply to the tick labels, in px. If not specified, D3's default font size will be used.
   */
  tickLabelFontSize(value: number): this {
    this._tickLabelFontSize = value;
    return this;
  }
  /**
   * A value that is passed to D3's [tickSizeOuter]{@link https://github.com/d3/d3-axis#axis_tickSizeOuter}
   *  method.
   *
   * If not provided, value will be set to 0.
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
   *
   * Note: In `Bars`, bar labels are tick labels.
   */
  wrapTickText(setProperties: (wrap: TickWrapBuilder) => void): this {
    this.tickWrapBuilder = new TickWrapBuilder();
    setProperties(this.tickWrapBuilder);
    return this;
  }
}

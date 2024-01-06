import { AxisTimeInterval } from 'd3';
import { VicTickWrapConfig } from '../svg-text-wrap/tick-wrap.config';

export class VicAxisConfig {
  /**
   * Used only on quantitative axes.
   *
   * A value that will be sent to D3's [ticks]{@link https://github.com/d3/d3-axis#axis_ticks}
   *  method.
   *
   * If ticks are formatted as integers and this value is greater than the domain,
   *  this value will be replaced by the largest number
   *  that fits the domain.
   *
   * If ticks are formatted as percentages and this value is greater than would
   *  fit the domain given the precision of the percentage format, this value
   *  will be replaced by the largest number that fits the domain.
   */
  numTicks?: number | AxisTimeInterval;

  /**
   * If true, the default line that D3 creates for the axis will be removed.
   */
  removeDomain?: boolean;

  /**
   * If true, all tick will be removed. Tick values will be retained.
   *
   * Note: likely to be used with Bars ordinal axis.
   */
  removeTickMarks?: boolean;

  /**
   * If true, all ticks (lines and values) will be removed.
   */
  removeTicks?: boolean;

  /**
   * Used only on quantitative axes.
   *
   * A string or function to use for formatting tick labels.
   *
   * If not provided on Quantitative Axes, ticks will be formatter with ',.1f'.
   */
  tickFormat?: string | ((value: number | Date) => string);

  /**
   * A font size to apply to the tick labels, in px. If not specified, D3's default font size will be used.
   */
  tickLabelFontSize?: number;

  /**
   * Used only on ordinal axes.
   *
   * A value that is passed to D3's [tickSizeOuter]{@link https://github.com/d3/d3-axis#axis_tickSizeOuter}
   *  method.
   *
   * If not provided, value will be set to 0.
   */
  tickSizeOuter?: number;

  /**
   * Used only on quantitative axes.
   *
   * An array of values to use for ticks. If specified, D3 will not generate its own ticks.
   *
   * Serves as a parameter for D3's [tickValues]{@link https://github.com/d3/d3-axis#axis_tickValues}
   *  method.
   *
   * Values will be formatted with either the provided value for
   *  [tickFormat]{@link VicAxisConfig.tickFormat} or the default format.
   */
  tickValues?: number[] | Date[];

  /**
   * A config object to specify how tick labels should wrap.
   *
   * Note: In `Bars`, bar labels are tick labels.
   */
  wrap?: VicTickWrapConfig;

  constructor(init?: Partial<VicAxisConfig>) {
    Object.assign(this, init);
  }
}

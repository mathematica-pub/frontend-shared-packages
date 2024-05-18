import { VicTickWrapConfig } from '../svg-text-wrap/tick-wrap.config';

const DEFAULT = {};

export interface VicXyAxisOptions<TickValue> {
  /**
   * If true, the default line that D3 creates for the axis will be removed.
   */
  removeDomain: boolean;
  /**
   * If true, all tick will be removed. Tick values will be retained.
   *
   * Note: likely to be used with Bars ordinal axis.
   */
  removeTickMarks: boolean;
  /**
   * If true, all ticks (lines and values) will be removed.
   */
  removeTicks: boolean;
  /**
   * A string or function to use for formatting tick labels.
   *
   * If not provided on Quantitative Axes, ticks will be formatter with ',.1f'.
   *
   * If the formatter does not include a decimal point, a warning will be logged in the console and internal tick validation will be disabled.
   */
  tickFormat: string | ((value: TickValue) => string);
  /**
   * A font size to apply to the tick labels, in px. If not specified, D3's default font size will be used.
   */
  tickLabelFontSize: number;
  /**
   * A config object to specify how tick labels should wrap.
   *
   * Note: In `Bars`, bar labels are tick labels.
   */
  wrap: VicTickWrapConfig;
}

export abstract class VicXyAxisConfig<TickValue> {
  removeDomain: boolean;
  removeTickMarks: boolean;
  removeTicks: boolean;
  tickFormat: string | ((value: TickValue) => string);
  tickLabelFontSize: number;
  wrap: VicTickWrapConfig;

  abstract getSuggestedNumTicksFromChartDimension(dimensions: {
    height: number;
    width: number;
  }): number;

  protected getValidatedNumTicks(numTicks: number): number {
    if (numTicks < 1) {
      return 1;
    }
    return Math.floor(numTicks);
  }
}

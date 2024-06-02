import { Chart } from '../chart/chart';
import { Ranges } from '../chart/chart.component';

export interface VicICommon {
  chart: Chart;
  ranges: Ranges;
}

export interface VicIData extends VicICommon {
  /**
   * setPropertiesFromRanges method
   *
   * This method sets creates and sets scales on ChartComponent. Any methods that require ranges
   * to create the scales should be called from this method. Methods called from here should not
   * require scales.
   *
   * This method is called on init, after config-based properties are set, and also on
   * resize/when ranges change.
   */
  setPropertiesFromRanges: (useTransition: boolean) => void;
}

export interface VicIMarks extends VicICommon {
  /**
   * drawMarks method
   *
   * All methods that require scales should be called from drawMarks. Methods
   * called from here should use scale.domain() or scale.range() to obtain those values
   * rather than this.config.dimension.domain or this.ranges.dimension.
   *
   * This method is called when scales emit from ChartComponent.
   */
  drawMarks: () => void;
  /**
   * getTransitionDuration method
   *
   * This method should return the duration of the transition to be used in the marks.
   */
  getTransitionDuration: () => number;
}

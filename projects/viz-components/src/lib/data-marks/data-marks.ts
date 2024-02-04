import { Chart } from '../chart/chart';
import { Ranges } from '../chart/chart.component';

export interface DataMarks {
  chart: Chart;
  ranges: Ranges;
  /**
   * setPropertiesFromConfig method
   *
   * This method handles an update to the config object. Methods called from here should not
   * requires ranges or scales. This method is called on init and on config update.
   */
  setPropertiesFromConfig: () => void;
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
  setValueArrays: () => void;
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
   * resizeMarks method
   *
   * All methods that should be called when the chart resizes due to browser layout should
   * be called from resizeMarks. Generally, the required method will update the scales, which
   * will in turn call drawMarks, but now always.
   *
   * This method is called when ranges emit from ChartComponent.
   */
  resizeMarks: () => void;
}

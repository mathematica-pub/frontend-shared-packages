import { Chart } from '../chart';

export interface Marks {
  chart: Chart;
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

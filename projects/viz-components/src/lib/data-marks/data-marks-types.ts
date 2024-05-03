import { Chart } from '../chart/chart';
import { Ranges } from '../chart/chart.component';

export interface VicICommon {
  chart: Chart;
  ranges: Ranges;
}

export interface VicIData extends VicICommon {
  /**
   * setPropertiesFromConfig method
   *
   * This method handles an update to the config object. Methods called from here should not
   * requires ranges or scales. This method is called on init and on config update.
   */
  setPropertiesFromData: () => void;
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

export interface VicDataMarksConfig<Datum> {
  /**
   * An array of data objects to be used to create marks.
   * The objects can be of an type, and can contain any number of properties, including properties that are extraneous to the chart at hand.
   *
   * @default: []
   * Default is []
   */
  data: Datum[];
  /**
   * A blend mode applied to the primary svg g elements in various marks components.
   *
   * @default: 'normal'
   * Default is 'normal'
   */
  mixBlendMode: string;
}

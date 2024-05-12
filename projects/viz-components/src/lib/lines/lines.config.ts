import { curveLinear, schemeTableau10 } from 'd3';
import { VicDataMarksConfig } from '../data-marks/data-marks-types';
import { VicCategoricalDimension } from '../data-marks/dimensions/categorical-dimension';
import { VicDateDimension } from '../data-marks/dimensions/date-dimension';
import { VicQuantitativeDimension } from '../data-marks/dimensions/quantitative-dimension';
import { VicLinesStroke } from './lines-stroke';
import { VicPointMarkers } from './point-markers';

export class VicLinesConfig<Datum> implements VicDataMarksConfig<Datum> {
  data: Datum[];
  mixBlendMode: string;
  /**
   * A config for the behavior of the chart's x dimension
   */
  x: VicDateDimension<Datum>;

  /**
   * A config for the behavior of the chart's y dimension
   */
  y: VicQuantitativeDimension<Datum>;

  /**
   * A config for the behavior of the chart's categorical dimension.
   *
   * Default colors array is D3's [schemeTableau10]{@link https://github.com/d3/d3-scale-chromatic#schemeTableau10}.
   */
  categorical: VicCategoricalDimension<Datum, string>;

  /**
   * A function that returns a boolean indicating whether a value in the data is defined.
   *  If a value is not defined, it will not be plotted.
   *
   * Used, in conjunction with a check that the value is a number of a Date, with D3's
   *  [line.defined()]{@link https://github.com/d3/d3-shape#line_defined} method.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  valueIsDefined?: (d: Datum, i: number, ...args: any) => any;

  /**
   * A function passed to D3's [line.curve()]{@link https://github.com/d3/d3-shape#line_curve}
   *  method.
   *
   * Default is [curveLinear]{@link https://github.com/d3/d3-shape#curveLinear}.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  curve: (x: any) => any;

  /**
   * A config for the behavior of markers for each datum on the line.
   */
  pointMarkers: VicPointMarkers;

  /**
   * A config for a dot that will appear on hover of a line. Intended to be used when there
   *  are no point markers along the line (i.e. at all points), particularly when a tooltip with point-specific
   *  data will be displayed. Will not be displayed if pointMarkers.display is true.
   */
  hoverDot: VicPointMarkers;

  /**
   * A config for the behavior of the line stroke.
   */
  stroke?: VicLinesStroke;

  /**
   * A boolean to determine if the line will be labeled.
   */
  labelLines?: boolean;

  /**
   * A function that returns a string to be used as the label for a line. Can be used to modify the
   * line label string as needed.
   *
   * Default is the identity function.
   */
  lineLabelsFormat?: (d: string) => string;

  /**
   * The distance from a line in which a hover event will trigger a tooltip, in px.
   *  Default is 80.
   *
   * This is used to ensure that a tooltip is triggered only when a user's pointer is close to lines.
   */
  pointerDetectionRadius: number;

  constructor(init?: Partial<VicLinesConfig<Datum>>) {
    this.mixBlendMode = 'normal';
    this.x = new VicDateDimension();
    this.y = new VicQuantitativeDimension();
    this.categorical = new VicCategoricalDimension({
      range: schemeTableau10 as string[],
    });
    this.curve = curveLinear;
    this.pointMarkers = new VicPointMarkers();
    this.hoverDot = new VicPointMarkers({ radius: 4, display: false });
    this.stroke = new VicLinesStroke();
    this.lineLabelsFormat = (d: string) => d;
    this.pointerDetectionRadius = 80;
    Object.assign(this, init);
  }
}

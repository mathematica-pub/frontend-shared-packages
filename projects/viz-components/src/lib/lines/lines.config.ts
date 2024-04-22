import { curveLinear, schemeTableau10 } from 'd3';
import { VicDataMarksConfig } from '../data-marks/data-marks.config';
import { VicCategoricalDimensionConfig } from '../data-marks/dimensions/categorical-dimension';
import { VicDateDimensionConfig } from '../data-marks/dimensions/date-dimension';
import { VicQuantitativeDimensionConfig } from '../data-marks/dimensions/quantitative-dimension';

export class VicLinesConfig<Datum> extends VicDataMarksConfig<Datum> {
  /**
   * A config for the behavior of the chart's x dimension
   *
   * Default valueAccessor method returns the datum.
   *
   * Default scaleType is D3's [scaleUtc]{@link https://github.com/d3/d3-scale#scaleUtc}.
   */
  x: VicDateDimensionConfig<Datum> = new VicDateDimensionConfig();

  /**
   * A config for the behavior of the chart's y dimension
   *
   * Default valueAccessor method returns the datum.
   *
   * Default scaleType is D3's [scaleLinear]{@link https://github.com/d3/d3-scale#scaleLinear}.
   */
  y: VicQuantitativeDimensionConfig<Datum> =
    new VicQuantitativeDimensionConfig();

  /**
   * A config for the behavior of the chart's category dimension.
   *
   * Default `valueAccessor` method returns 1.
   *
   * Default colors array is D3's [schemeTableau10]{@link https://github.com/d3/d3-scale-chromatic#schemeTableau10}.
   */
  category: VicCategoricalDimensionConfig<Datum, string> =
    new VicCategoricalDimensionConfig();

  /**
   * A function that returns a boolean indicating whether a value in the data is defined.
   *  If a value is not defined, it will not be plotted.
   *
   * Used, in conjunction with a check that the value is a number of a Date, with D3's
   *  [line.defined()]{@link https://github.com/d3/d3-shape#line_defined} method.
   */
  valueIsDefined?: (...args: any) => any;

  /**
   * A function passed to D3's [line.curve()]{@link https://github.com/d3/d3-shape#line_curve}
   *  method.
   *
   * Default is [curveLinear]{@link https://github.com/d3/d3-shape#curveLinear}.
   */
  curve: (x: any) => any;

  /**
   * A config for the behavior of markers for each datum on the line.
   */
  pointMarkers: VicPointMarkersConfig = new VicPointMarkersConfig();

  /**
   * A config for a dot that will appear on hover of a line. Intended to be used when there
   *  are no point markers along the line (i.e. at all points), particularly when a tooltip with point-specific
   *  data will be displayed. Will not be displayed if pointMarkers.display is true.
   */
  hoverDot: VicPointMarkerConfig = new VicPointMarkerConfig();

  /**
   * A config for the behavior of the line stroke.
   */
  stroke?: VicLinesStrokeConfig = new VicLinesStrokeConfig();

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
    super();
    this.category.valueAccessor = () => undefined;
    this.category.range = schemeTableau10 as string[];
    this.curve = curveLinear;
    this.lineLabelsFormat = (d: string) => d;
    this.pointerDetectionRadius = 80;
    this.hoverDot.radius = 4;
    Object.assign(this, init);
  }
}

export class VicLinesStrokeConfig {
  /**
   * A value for the line's [stroke-linecap]{@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linecap}
   *  attribute.
   *
   * Default is 'round'.
   */
  linecap: string;

  /**
   * A value for the line's [stroke-linejoin]{@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linejoin}
   *  attribute.
   *
   * Default is 'round'.
   */
  linejoin: string;

  /**
   * A value for the line's [stroke-opacity]{@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-opacity}
   *  attribute.
   *
   * Default is 1.
   */
  opacity: number;

  /**
   * A value for the line's [stroke-width]{@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-width}
   *  attribute.
   *
   * Default is 2.
   */
  width: number;

  constructor(init?: Partial<VicLinesStrokeConfig>) {
    this.linecap = 'round';
    this.linejoin = 'round';
    this.opacity = 1;
    this.width = 2;
    Object.assign(this, init);
  }
}

export class VicPointMarkerConfig {
  /**
   * A boolean to determine if point markers will be displayed.
   *
   * Default is true.
   */
  display: boolean;

  /**
   * A value for the radius of the point marker, in px.
   *
   * Default is 3.
   */
  radius: number;

  constructor(init?: Partial<VicPointMarkerConfig>) {
    this.display = false;
    this.radius = 3;
    Object.assign(this, init);
  }
}

export class VicPointMarkersConfig extends VicPointMarkerConfig {
  /**
   * A value by which the point marker will expand on hover, in px.
   *
   * Default is 1.
   */
  growByOnHover: number;

  constructor(init?: Partial<VicPointMarkersConfig>) {
    super();
    this.display = true;
    this.growByOnHover = 1;
    Object.assign(this, init);
  }
}

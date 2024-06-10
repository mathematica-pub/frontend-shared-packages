import { CurveFactory, curveLinear, group, range, schemeTableau10 } from 'd3';
import { isDate, isNumber } from '../../core/utilities/type-guards';
import { VicCategoricalDimension } from '../../data-dimensions/categorical-dimension';
import { VicDateDimension } from '../../data-dimensions/date-dimension';
import { VicQuantitativeDimension } from '../../data-dimensions/quantitative-dimension';
import { VicDataMarksOptions } from '../../data-marks/data-marks.config';
import { VicXyDataMarksConfig } from '../../xy-data-marks/xy-data-marks-config';
import { Marker } from '../lines.component';
import { VicLinesStroke } from './lines-stroke';
import { VicPointMarkers } from './point-markers';

const LINE_DEFAULTS = {
  curve: curveLinear,
  pointMarkers: new VicPointMarkers(),
  hoverDot: new VicPointMarkers({ radius: 4, display: false }),
  stroke: new VicLinesStroke(),
  pointerDetectionRadius: 80,
  lineLabelsFormat: (d: string) => d,
  categorical: {
    range: schemeTableau10 as string[],
  },
};

export interface VicLinesOptions<Datum> extends VicDataMarksOptions<Datum> {
  /**
   * A config for the behavior of the chart's categorical dimension.
   *
   * Default colors array is D3's [schemeTableau10]{@link https://github.com/d3/d3-scale-chromatic#schemeTableau10}.
   */
  categorical: VicCategoricalDimension<Datum, string>;
  /**
   * A function passed to D3's [line.curve()]{@link https://github.com/d3/d3-shape#line_curve}
   *  method.
   *
   * Default is [curveLinear]{@link https://github.com/d3/d3-shape#curveLinear}.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  curve: CurveFactory;
  /**
   * A config for a dot that will appear on hover of a line. Intended to be used when there
   *  are no point markers along the line (i.e. at all points), particularly when a tooltip with point-specific
   *  data will be displayed. Will not be displayed if pointMarkers.display is true.
   */
  hoverDot: VicPointMarkers;
  /**
   * A boolean to determine if the line will be labeled.
   */
  labelLines: boolean;
  /**
   * A function that returns a string to be used as the label for a line. Can be used to modify the
   * line label string as needed.
   *
   * Default is the identity function.
   */
  lineLabelsFormat: (d: string) => string;
  /**
   * The distance from a line in which a hover event will trigger a tooltip, in px.
   *  Default is 80.
   *
   * This is used to ensure that a tooltip is triggered only when a user's pointer is close to lines.
   */
  pointerDetectionRadius: number;
  /**
   * A config for the behavior of markers for each datum on the line.
   */
  pointMarkers: VicPointMarkers;
  /**
   * A config for the behavior of the line stroke.
   */
  stroke: VicLinesStroke;
  /**
   * A function that returns a boolean indicating whether a value in the data is defined.
   *  If a value is not defined, it will not be plotted.
   *
   * Used, in conjunction with a check that the value is a number of a Date, with D3's
   *  [line.defined()]{@link https://github.com/d3/d3-shape#line_defined} method.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  valueIsDefined: (d: Datum, i: number, ...args: any) => any;
  /**
   * A config for the behavior of the chart's x dimension
   */
  x: VicDateDimension<Datum> | VicQuantitativeDimension<Datum>;
  /**
   * A config for the behavior of the chart's y dimension
   */
  y: VicQuantitativeDimension<Datum>;
}

export class VicLinesConfig<Datum>
  extends VicXyDataMarksConfig<Datum>
  implements VicLinesOptions<Datum>
{
  categorical: VicCategoricalDimension<Datum, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  curve: (x: any) => any;
  hoverDot: VicPointMarkers;
  labelLines: boolean;
  lineLabelsFormat: (d: string) => string;
  linesD3Data;
  linesKeyFunction;
  markersD3Data;
  markersKeyFunction;
  pointerDetectionRadius: number;
  pointMarkers: VicPointMarkers;
  stroke: VicLinesStroke;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  valueIsDefined: (d: Datum, i: number, ...args: any) => any;
  x: VicDateDimension<Datum> | VicQuantitativeDimension<Datum>;
  y: VicQuantitativeDimension<Datum>;

  constructor(options: Partial<VicLinesOptions<Datum>>) {
    super();
    Object.assign(this, options);
    this.curve = this.curve ?? LINE_DEFAULTS.curve;
    this.pointMarkers = this.pointMarkers ?? LINE_DEFAULTS.pointMarkers;
    this.hoverDot = this.hoverDot ?? LINE_DEFAULTS.hoverDot;
    this.stroke = this.stroke ?? LINE_DEFAULTS.stroke;
    this.pointerDetectionRadius =
      this.pointerDetectionRadius ?? LINE_DEFAULTS.pointerDetectionRadius;
    this.lineLabelsFormat =
      this.lineLabelsFormat ?? LINE_DEFAULTS.lineLabelsFormat;
    this.initPropertiesFromData();
  }

  protected initPropertiesFromData(): void {
    this.setDimensionPropertiesFromData();
    this.setValueIndicies();
    this.setLinesD3Data();
    this.setLinesKeyFunction();
    this.setMarkersD3Data();
    this.setMarkersKeyFunction();
  }

  private setDimensionPropertiesFromData(): void {
    this.x.setPropertiesFromData(this.data);
    this.y.setPropertiesFromData(this.data);
    this.categorical.setPropertiesFromData(this.data);
  }

  private setValueIndicies(): void {
    this.valueIndicies = range(this.x.values.length).filter((i) =>
      this.categorical.domainIncludes(this.categorical.values[i])
    );
  }

  private setLinesD3Data(): void {
    const definedIndices = this.valueIndicies.filter(
      (i) =>
        this.canBeDrawnByPath(this.x.values[i]) &&
        this.canBeDrawnByPath(this.y.values[i])
    );
    this.linesD3Data = group(definedIndices, (i) => this.categorical.values[i]);
  }

  canBeDrawnByPath(x: unknown): boolean {
    return (isNumber(x) || isDate(x)) && x !== null && x !== undefined;
  }

  private setLinesKeyFunction(): void {
    this.linesKeyFunction = (d): string => d[0];
  }

  private setMarkersD3Data(): void {
    this.markersD3Data = this.valueIndicies
      .map((i) => {
        return { key: this.getMarkerKey(i), index: i };
      })
      .filter(
        (marker: Marker) =>
          this.canBeDrawnByPath(this.x.values[marker.index]) &&
          this.canBeDrawnByPath(this.y.values[marker.index])
      );
  }

  private getMarkerKey(i: number): string {
    return `${this.categorical.values[i]}-${this.x.values[i]}`;
  }

  private setMarkersKeyFunction(): void {
    this.markersKeyFunction = (d) => (d as Marker).key;
  }
}

/**
 * A function to create a horizontal bars configuration to be used with vic-data-marks-bars component
 * @param {Partial<VicBarsOptions<Datum, TOrdinalValue>>} options - **REQUIRED**
 * @param {VicCategoricalDimension<Datum, string>} options.categorical - **REQUIRED** - specify using vicCategoricalDimension
 * @param { VicDateDimension<Datum> | VicQuantitativeDimension<Datum>} options.x - **REQUIRED** - specify using vicDateDimension or vicQuantitativeDimension
 * @param {VicQuantitativeDimension<Datum>} options.y - **REQUIRED** - specify using vicQuantitativeDimension
 * @param {CurveFactory} options.curve - CurveFactory - A function passed to D3's [line.curve()]{@link https://github.com/d3/d3-shape#line_curve} method. Default is curveLinear.
 * @param {VicPointMarkers} options.hoverDot - VicPointMarkers - A config for a dot that will appear on hover of a line. Intended to be used when there are no point markers along the line (i.e. at all points), particularly when a tooltip with point-specific data will be displayed. Will not be displayed if pointMarkers.display is true.
 * @param {boolean} options.labelLines - boolean - A boolean to determine if the line will be labeled.
 * @param {(d: string) => string} options.lineLabelsFormat - (d: string) => string - A function that returns a string to be used as the label for a line. Can be used to modify the line label string as needed. Default is the identity function.
 * @param {number} options.pointerDetectionRadius - number - The distance from a line in which a hover event will trigger a tooltip, in px. This is used to ensure that a tooltip is triggered only when a user's pointer is close to lines. Default is 80.
 * @param {VicPointMarkers} options.pointMarkers - VicPointMarkers - A config for the behavior of markers for each datum on the line.
 * @param {VicLinesStroke} option.stroke - VicLinesStroke - A config for the behavior of the line stroke.
 * @param {(d: Datum, i: number, ...args: any) => any} options.valueIsDefined - (d: Datum, i: number, ...args: any) => any - A function that returns a boolean indicating whether a value in the data is defined. If a value is not defined, it will not be plotted. Used, in conjunction with a check that the value is a number of a Date, with D3's line.defined() method.
 * @returns
 */
export function vicLines<Datum>(
  options: Partial<VicLinesOptions<Datum>>
): VicLinesConfig<Datum> {
  return new VicLinesConfig(options);
}

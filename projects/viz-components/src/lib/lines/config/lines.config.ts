import { InternSet, curveLinear, group, range, schemeTableau10 } from 'd3';
import { isDate, isNumber } from '../../core/utilities/type-guards';
import { VicDataMarksOptions } from '../../data-marks/data-marks-types';
import { VicCategoricalDimension } from '../../data-marks/dimensions/categorical-dimension';
import { VicDateDimension } from '../../data-marks/dimensions/date-dimension';
import { VicQuantitativeDimension } from '../../data-marks/dimensions/quantitative-dimension';
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
   * A config for the behavior of the chart's x dimension
   */
  x: VicDateDimension<Datum> | VicQuantitativeDimension<Datum>;
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
  valueIsDefined: (d: Datum, i: number, ...args: any) => any;
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
  stroke: VicLinesStroke;
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
}

export class VicLinesConfig<Datum>
  extends VicXyDataMarksConfig<Datum>
  implements VicLinesOptions<Datum>
{
  x: VicDateDimension<Datum> | VicQuantitativeDimension<Datum>;
  y: VicQuantitativeDimension<Datum>;
  categorical: VicCategoricalDimension<Datum, string>;
  valueIsDefined: (d: Datum, i: number, ...args: any) => any;
  curve: (x: any) => any;
  pointMarkers: VicPointMarkers;
  hoverDot: VicPointMarkers;
  stroke: VicLinesStroke;
  labelLines: boolean;
  lineLabelsFormat: (d: string) => string;
  pointerDetectionRadius: number;
  linesD3Data;
  linesKeyFunction;
  markersD3Data;
  markersKeyFunction;

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
  }

  initPropertiesFromData(): void {
    this.setDimensionPropertiesFromData();
    this.setValueIndicies();
    this.setLinesD3Data();
    this.setLinesKeyFunction();
    this.setMarkersD3Data();
    this.setMarkersKeyFunction();
  }

  setDimensionPropertiesFromData(): void {
    this.x.setPropertiesFromData(this.data);
    this.y.setPropertiesFromData(this.data);
    this.categorical.setPropertiesFromData(this.data);
  }

  setValueIndicies(): void {
    const domainInternSet = new InternSet(this.categorical.domain);
    this.valueIndicies = range(this.x.values.length).filter((i) =>
      domainInternSet.has(this.categorical.values[i])
    );
  }

  setLinesD3Data(): void {
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

  setLinesKeyFunction(): void {
    this.linesKeyFunction = (d): string => d[0];
  }

  setMarkersD3Data(): void {
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

  getMarkerKey(i: number): string {
    return `${this.categorical.values[i]}-${this.x.values[i]}`;
  }

  setMarkersKeyFunction(): void {
    this.markersKeyFunction = (d) => (d as Marker).key;
  }
}

export function vicLines<Datum>(
  options: Partial<VicLinesOptions<Datum>>
): VicLinesConfig<Datum> {
  const config = new VicLinesConfig(options);
  config.initPropertiesFromData();
  return config;
}

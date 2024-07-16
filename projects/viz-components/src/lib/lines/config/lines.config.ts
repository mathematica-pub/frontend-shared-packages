import { CurveFactory, curveLinear, group, range, schemeTableau10 } from 'd3';
import { VicDimensionCategorical } from '../../data-dimensions/categorical/categorical';
import { VicDimensionQuantitativeDate } from '../../data-dimensions/quantitative/quantitative-date';
import { VicDimensionQuantitativeNumeric } from '../../data-dimensions/quantitative/quantitative-numeric';
import { VicDataMarksOptions } from '../../data-marks/config/data-marks-options';
import { VicPointMarkers } from '../../marks/point-markers';
import { VicStroke } from '../../marks/stroke';
import { VicXyDataMarksConfig } from '../../xy-data-marks/xy-data-marks-config';
import { LinesGroupSelectionDatum } from '../lines.component';

const DEFAULT = {
  curve: curveLinear,
  hoverDot: new VicPointMarkers({ radius: 4, display: false }),
  stroke: new VicStroke(),
  pointerDetectionRadius: 80,
  lineLabelsFormat: (d: string) => d,
  categorical: {
    range: schemeTableau10 as string[],
  },
};

export interface LinesMarkerDatum {
  key: string;
  index: number;
  category: string;
}

export interface VicLinesOptions<Datum> extends VicDataMarksOptions<Datum> {
  /**
   * A config for the behavior of the chart's categorical dimension.
   *
   * Default colors array is D3's [schemeTableau10]{@link https://github.com/d3/d3-scale-chromatic#schemeTableau10}.
   */
  categorical: VicDimensionCategorical<Datum, string>;
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
  stroke: VicStroke;
  /**
   * A config for the behavior of the chart's x dimension
   */
  x:
    | VicDimensionQuantitativeDate<Datum>
    | VicDimensionQuantitativeNumeric<Datum>;
  /**
   * A config for the behavior of the chart's y dimension
   */
  y: VicDimensionQuantitativeNumeric<Datum>;
}

export class VicLinesConfig<Datum>
  extends VicXyDataMarksConfig<Datum>
  implements VicLinesOptions<Datum>
{
  readonly categorical: VicDimensionCategorical<Datum, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly curve: (x: any) => any;
  readonly hoverDot: VicPointMarkers;
  readonly labelLines: boolean;
  readonly lineLabelsFormat: (d: string) => string;
  linesD3Data;
  linesKeyFunction: (d: LinesGroupSelectionDatum) => string;
  readonly pointerDetectionRadius: number;
  readonly pointMarkers: VicPointMarkers;
  readonly stroke: VicStroke;
  readonly x:
    | VicDimensionQuantitativeDate<Datum>
    | VicDimensionQuantitativeNumeric<Datum>;
  readonly y: VicDimensionQuantitativeNumeric<Datum>;

  constructor(options: Partial<VicLinesOptions<Datum>>) {
    super();
    Object.assign(this, DEFAULT, options);
    this.initPropertiesFromData();
  }

  protected initPropertiesFromData(): void {
    this.setDimensionPropertiesFromData();
    this.setValueIndices();
    this.setLinesD3Data();
    this.setLinesKeyFunction();
  }

  private setDimensionPropertiesFromData(): void {
    this.x.setPropertiesFromData(this.data);
    this.y.setPropertiesFromData(this.data);
    this.categorical.setPropertiesFromData(this.data);
  }

  private setValueIndices(): void {
    this.valueIndices = range(this.x.values.length).filter((i) =>
      this.categorical.domainIncludes(this.categorical.values[i])
    );
  }

  private setLinesD3Data(): void {
    const definedIndices = this.valueIndices.filter(
      (i) =>
        this.x.isValidValue(this.x.values[i]) &&
        this.y.isValidValue(this.y.values[i])
    );
    this.linesD3Data = group(definedIndices, (i) => this.categorical.values[i]);
  }

  private setLinesKeyFunction(): void {
    this.linesKeyFunction = (d): string => d[0];
  }

  getMarkersData(indices: number[]): LinesMarkerDatum[] {
    return indices.map((i) => {
      return {
        key: this.getMarkerKey(i),
        index: i,
        category: this.categorical.values[i],
      };
    });
  }

  private getMarkerKey(i: number): string {
    return `${this.categorical.values[i]}-${this.x.values[i]}`;
  }
}

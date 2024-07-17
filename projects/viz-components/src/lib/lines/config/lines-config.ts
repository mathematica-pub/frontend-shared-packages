import { CurveFactory, group, range } from 'd3';
import { VicStroke } from 'projects/viz-components/src/public-api';
import { VicDimensionCategorical } from '../../data-dimensions/categorical/categorical';
import { VicDimensionQuantitativeDate } from '../../data-dimensions/quantitative/quantitative-date';
import { VicDimensionQuantitativeNumeric } from '../../data-dimensions/quantitative/quantitative-numeric';
import { VicPointMarkers } from '../../marks/point-markers/point-markers';
import { VicXyDataMarksConfig } from '../../xy-data-marks/xy-data-marks-config';
import { LinesGroupSelectionDatum } from '../lines.component';
import { VicLinesOptions } from './lines-options';

export interface LinesMarkerDatum {
  key: string;
  index: number;
  category: string;
}

export class VicLinesConfig<Datum>
  extends VicXyDataMarksConfig<Datum>
  implements VicLinesOptions<Datum>
{
  readonly categorical: VicDimensionCategorical<Datum, string>;
  readonly curve: CurveFactory;
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

  constructor(options: VicLinesOptions<Datum>) {
    super();
    Object.assign(this, options);
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

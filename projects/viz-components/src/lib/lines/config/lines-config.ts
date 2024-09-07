import { CurveFactory, group, range } from 'd3';
import { PointMarkers } from '../..//point-markers/point-markers';
import { CategoricalDimension } from '../../data-dimensions/categorical/categorical';
import { QuantitativeDateDimension } from '../../data-dimensions/quantitative/quantitative-date';
import { QuantitativeNumericDimension } from '../../data-dimensions/quantitative/quantitative-numeric';
import { Stroke } from '../../stroke/stroke';
import { XyDataMarksConfig } from '../../xy-data-marks/xy-data-marks-config';
import { LinesGroupSelectionDatum } from '../lines.component';
import { LinesOptions } from './lines-options';

export interface LinesMarkerDatum {
  key: string;
  index: number;
  category: string;
  display: string;
}

export class LinesConfig<Datum>
  extends XyDataMarksConfig<Datum>
  implements LinesOptions<Datum>
{
  readonly categorical: CategoricalDimension<Datum, string>;
  readonly curve: CurveFactory;
  readonly labelLines: boolean;
  readonly lineLabelsFormat: (d: string) => string;
  linesD3Data;
  linesKeyFunction: (d: LinesGroupSelectionDatum) => string;
  readonly pointerDetectionRadius: number;
  readonly pointMarkers: PointMarkers<Datum>;
  readonly stroke: Stroke;
  readonly x:
    | QuantitativeDateDimension<Datum>
    | QuantitativeNumericDimension<Datum>;
  readonly y: QuantitativeNumericDimension<Datum>;

  constructor(options: LinesOptions<Datum>) {
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

  getPointMarkersData(indices: number[]): LinesMarkerDatum[] {
    return indices.map((i) => {
      return {
        key: this.getMarkerKey(i),
        index: i,
        category: this.categorical.values[i],
        display: this.pointMarkers.display(this.data[i]) ? 'block' : 'none',
      };
    });
  }

  private getMarkerKey(i: number): string {
    return `${this.categorical.values[i]}-${this.x.values[i]}`;
  }
}

import { CurveFactory, group, range } from 'd3';
import { CategoricalDimension } from '../../data-dimensions/categorical/categorical';
import { DateNumberDimension } from '../../data-dimensions/quantitative/date-number/date-number';
import { NumberChartPositionDimension } from '../../data-dimensions/quantitative/number-chart-position/number-chart-position';
import { XyPrimaryMarksConfig } from '../../marks/xy-marks/xy-primary-marks/xy-primary-marks-config';
import { PointMarkers } from '../../point-markers/point-markers';
import { Stroke } from '../../stroke/stroke';
import { LinesGroupSelectionDatum } from '../lines.component';
import { AreaFills } from './area-fills/area-fills';
import { LinesOptions } from './lines-options';

export interface LinesMarkerDatum {
  key: string;
  index: number;
  category: string;
  display: string;
}

export class LinesConfig<Datum>
  extends XyPrimaryMarksConfig<Datum>
  implements LinesOptions<Datum>
{
  readonly color: CategoricalDimension<Datum, string, string>;
  readonly curve: CurveFactory;
  readonly labelLines: boolean;
  readonly lineLabelsFormat: (d: string) => string;
  linesD3Data;
  linesKeyFunction: (d: LinesGroupSelectionDatum) => string;
  readonly areaFills: AreaFills<Datum>;
  readonly pointerDetectionRadius: number;
  readonly pointMarkers: PointMarkers<Datum>;
  readonly stroke: Stroke;
  readonly x: DateNumberDimension<Datum> | NumberChartPositionDimension<Datum>;
  readonly y: NumberChartPositionDimension<Datum>;

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
    this.color.setPropertiesFromData(this.data);
  }

  private setValueIndices(): void {
    this.valueIndices = range(this.x.values.length).filter((i) =>
      this.color.domainIncludes(this.color.values[i])
    );
  }

  private setLinesD3Data(): void {
    const definedIndices = this.valueIndices.filter(
      (i) =>
        this.x.isValidValue(this.x.values[i]) &&
        this.y.isValidValue(this.y.values[i])
    );
    this.linesD3Data = group(definedIndices, (i) => this.color.values[i]);
  }

  private setLinesKeyFunction(): void {
    this.linesKeyFunction = (d): string => d[0];
  }

  getPointMarkersData(indices: number[]): LinesMarkerDatum[] {
    return indices.map((i) => {
      return {
        key: this.getMarkerKey(i),
        index: i,
        category: this.color.values[i],
        display: this.pointMarkers.display(this.data[i]) ? 'block' : 'none',
      };
    });
  }

  private getMarkerKey(i: number): string {
    return `${this.color.values[i]}-${this.x.values[i]}`;
  }
}

import { CurveFactory, group, range } from 'd3';
import { DateChartPositionDimension } from '../../data-dimensions/continuous-quantitative/date-chart-position/date-chart-position';
import { NumberChartPositionDimension } from '../../data-dimensions/continuous-quantitative/number-chart-position/number-chart-position';
import { XyPrimaryMarksConfig } from '../../marks/xy-marks/xy-primary-marks/xy-primary-marks-config';
import { PointMarkers } from '../../point-markers/point-markers';
import { LinesGroupSelectionDatum } from '../lines.component';
import { AreaFills } from './area-fills/area-fills';
import { LinesOptions } from './lines-options';
import { LinesStroke } from './stroke/lines-stroke';

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
  readonly curve: CurveFactory;
  readonly labelLines: boolean;
  readonly lineLabelsFormat: (d: string) => string;
  linesD3Data;
  linesKeyFunction: (d: LinesGroupSelectionDatum) => string;
  readonly areaFills: AreaFills<Datum>;
  readonly pointerDetectionRadius: number;
  readonly pointMarkers: PointMarkers<Datum>;
  readonly stroke: LinesStroke<Datum>;
  readonly x:
    | DateChartPositionDimension<Datum>
    | NumberChartPositionDimension<Datum>;
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
    this.stroke.color.setPropertiesFromData(this.data);
  }

  private setValueIndices(): void {
    this.valueIndices = range(this.x.values.length).filter((i) =>
      this.stroke.color.domainIncludes(this.stroke.color.values[i])
    );
  }

  private setLinesD3Data(): void {
    const definedIndices = this.valueIndices.filter(
      (i) =>
        this.x.isValidValue(this.x.values[i]) &&
        this.y.isValidValue(this.y.values[i])
    );
    this.linesD3Data = group(
      definedIndices,
      (i) => this.stroke.color.values[i]
    );
  }

  getDataFromCategory(category: string): Datum[] {
    return this.linesD3Data.get(category).map((i) => this.data[i]);
  }

  private setLinesKeyFunction(): void {
    this.linesKeyFunction = (d): string => d[0];
  }

  getPointMarkersData(indices: number[]): LinesMarkerDatum[] {
    return indices.map((i) => {
      return {
        key: this.getMarkerKey(i),
        index: i,
        category: this.stroke.color.values[i],
        display: this.pointMarkers.display(this.data[i]) ? 'block' : 'none',
      };
    });
  }

  private getMarkerKey(i: number): string {
    return `${this.stroke.color.values[i]}-${this.x.values[i]}`;
  }
}

import { DataValue } from '../../core/types/values';
import { OrdinalChartMultipleDimension } from '../../data-dimensions/ordinal/ordinal-chart-multiple/ordinal-chart-multiple';

export interface MarksOptions {
  mixBlendMode: string;
  marksClass: string;
}

export interface AuxMarksOptions<Datum> extends MarksOptions {
  data: Datum[];
  datumClass: (d: Datum, i: number) => string;
}

export interface DataMarksOptions<Datum, ChartMultipleDomain extends DataValue>
  extends AuxMarksOptions<Datum> {
  multiples: OrdinalChartMultipleDimension<Datum, ChartMultipleDomain>;
}

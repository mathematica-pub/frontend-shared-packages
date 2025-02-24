import { DataValue } from '../../core/types/values';
import { DataMarksConfig } from '../config/marks-config';

export abstract class XyMarksConfig<
  Datum,
  ChartMultipleDomain extends DataValue,
> extends DataMarksConfig<Datum, ChartMultipleDomain> {
  valueIndices: number[];
}

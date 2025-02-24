import { DataValue } from '../../../core/types/values';
import { PrimaryMarksConfig } from '../../primary-marks/config/primary-marks-config';

export abstract class XyPrimaryMarksConfig<
  Datum,
  ChartMultipleDomain extends DataValue,
> extends PrimaryMarksConfig<Datum, ChartMultipleDomain> {
  valueIndices: number[];
}

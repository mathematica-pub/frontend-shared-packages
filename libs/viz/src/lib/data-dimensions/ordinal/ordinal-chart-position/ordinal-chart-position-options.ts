import { DataValue } from '../../../core/types/values';
import { DataDimensionOptions } from '../../dimension-options';

export interface OrdinalChartPositionDimensionOptions<
  Datum,
  Domain extends DataValue,
> extends DataDimensionOptions<Datum, Domain> {
  align: number;
  domain: Domain[];
  paddingInner: number;
  paddingOuter: number;
}

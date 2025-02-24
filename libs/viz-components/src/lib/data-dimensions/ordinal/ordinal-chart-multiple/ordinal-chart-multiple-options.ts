import { DataValue } from '../../../core/types/values';
import { DataDimensionOptions } from '../../dimension-options';

export interface OrdinalChartMultipleOptions<Datum, Domain extends DataValue>
  extends DataDimensionOptions<Datum, Domain> {
  domain: Domain[];
}

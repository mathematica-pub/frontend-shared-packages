import { DataValue, VisualValue } from '../../../core/types/values';
import { DataDimensionOptions } from '../../dimension-options';

export interface OrdinalVisualValueDimensionOptions<
  Datum,
  Domain extends DataValue,
  Range extends VisualValue,
> extends DataDimensionOptions<Datum, Domain> {
  domain: Domain[];
  range: Range[];
  scale: (category: Domain) => Range;
}

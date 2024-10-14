import { DataValue, VisualValue } from '../../core/types/values';
import { FillDef } from '../../fill-defs/fill-def';
import { DataDimensionOptions } from '../dimension-options';

export interface CategoricalDimensionOptions<
  Datum,
  Domain extends DataValue,
  Range extends VisualValue,
> extends DataDimensionOptions<Datum, Domain> {
  domain: Domain[];
  fillDefs: FillDef<Datum>[];
  range: Range[];
  scale: (category: Domain) => Range;
}

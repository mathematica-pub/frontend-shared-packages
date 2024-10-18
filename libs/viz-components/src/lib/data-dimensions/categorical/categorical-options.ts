import { DataValue } from '../../core/types/values';
import { FillDef } from '../../fill-defs/fill-def';
import { DataDimensionOptions } from '../dimension-options';

export interface CategoricalDimensionOptions<
  Datum,
  TCategoricalValue extends DataValue = string,
> extends DataDimensionOptions<Datum, TCategoricalValue> {
  domain: TCategoricalValue[];
  fillDefs: FillDef<Datum>[];
  range: string[];
  scale: (category: TCategoricalValue) => string;
}

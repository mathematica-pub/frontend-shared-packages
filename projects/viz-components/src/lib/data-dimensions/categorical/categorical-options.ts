import { DataValue } from '../../core/types/values';
import { DataDimensionOptions } from '../dimension-options';
import { FillPattern } from './fill-pattern';

export interface CategoricalDimensionOptions<
  Datum,
  TCategoricalValue extends DataValue = string
> extends DataDimensionOptions<Datum, TCategoricalValue> {
  domain: TCategoricalValue[];
  fillPatterns: FillPattern<Datum>[];
  range: string[];
  scale: (category: TCategoricalValue) => string;
}

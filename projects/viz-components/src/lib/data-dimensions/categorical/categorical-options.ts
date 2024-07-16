import { VicDataValue } from 'projects/viz-components/src/public-api';
import { VicDataDimensionOptions } from '../dimension-options';
import { VicFillPattern } from './fill-pattern';

export interface VicCategoricalDimensionOptions<
  Datum,
  TCategoricalValue extends VicDataValue = string
> extends VicDataDimensionOptions<Datum, TCategoricalValue> {
  domain: TCategoricalValue[];
  fillPatterns: VicFillPattern<Datum>[];
  range: string[];
  scale: (category: TCategoricalValue) => string;
}

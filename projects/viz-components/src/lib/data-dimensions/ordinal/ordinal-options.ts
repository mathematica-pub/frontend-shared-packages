import { VicDataValue } from 'projects/viz-components/src/public-api';
import { VicDataDimensionOptions } from '../dimension-options';

export interface VicDimensionOrdinalOptions<
  Datum,
  TOrdinalValue extends VicDataValue
> extends VicDataDimensionOptions<Datum, TOrdinalValue> {
  align: number;
  domain: TOrdinalValue[];
  paddingInner: number;
  paddingOuter: number;
}

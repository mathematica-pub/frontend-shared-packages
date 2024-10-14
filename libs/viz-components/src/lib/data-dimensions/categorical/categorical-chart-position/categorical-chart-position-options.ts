import { DataValue } from '../../../core/types/values';
import { DataDimensionOptions } from '../../dimension-options';

export interface CategoricalChartPositionDimensionOptions<
  Datum,
  TOrdinalValue extends DataValue,
> extends DataDimensionOptions<Datum, TOrdinalValue> {
  align: number;
  domain: TOrdinalValue[];
  paddingInner: number;
  paddingOuter: number;
}

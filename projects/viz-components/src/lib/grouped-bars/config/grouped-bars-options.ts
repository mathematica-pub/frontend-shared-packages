import { BarsOptions } from '../../bars/config/bars-options';
import { DataValue } from '../../core/types/values';

export interface GroupedBarsOptions<Datum, TOrdinalValue extends DataValue>
  extends BarsOptions<Datum, TOrdinalValue> {
  intraGroupPadding: number;
}

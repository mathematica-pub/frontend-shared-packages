import { DataValue } from '../../core/types/values';
import { BarsTooltipData } from '../bars.component';

export interface BarsEventOutput<Datum, TOrdinalValue extends DataValue>
  extends BarsTooltipData<Datum, TOrdinalValue> {
  positionX: number;
  positionY: number;
}

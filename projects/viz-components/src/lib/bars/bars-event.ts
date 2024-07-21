import { DataValue } from '../core/types/values';
import { BarsTooltipOutput } from './bars-tooltip';

export interface BarsEventOutput<Datum, TOrdinalValue extends DataValue>
  extends BarsTooltipOutput<Datum, TOrdinalValue> {
  positionX: number;
  positionY: number;
}

import { DataValue } from '../../core/types/values';
import { BarsTooltipDatum } from '../bars.component';

export interface BarsEventOutput<Datum, TOrdinalValue extends DataValue>
  extends BarsTooltipDatum<Datum, TOrdinalValue> {
  origin: SVGRectElement;
  positionX: number;
  positionY: number;
}

import { DataValue } from '../../core/types/values';
import { EventType } from '../../events';
import { BarsTooltipDatum } from '../bars.component';

export interface BarsInteractionOutput<Datum, TOrdinalValue extends DataValue>
  extends BarsTooltipDatum<Datum, TOrdinalValue> {
  origin: SVGRectElement;
  positionX: number;
  positionY: number;
  type: EventType;
}

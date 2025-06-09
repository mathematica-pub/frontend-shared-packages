import { EventType } from '../../events/refactor-event.directive';
import { LinesTooltipDatum } from '../lines.component';

export interface LinesInteractionOutput<Datum>
  extends LinesTooltipDatum<Datum> {
  positionX: number;
  positionY: number;
  type: EventType;
}

import { EventType } from '../../events/refactor-event.directive';
import { DotsTooltipDatum } from '../dots.component';

export interface DotsInteractionOutput<Datum> extends DotsTooltipDatum<Datum> {
  origin: SVGCircleElement;
  positionX: number;
  positionY: number;
  type: EventType;
}

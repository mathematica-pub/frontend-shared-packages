import { EventType } from '../../events';
import { GeographiesTooltipDatum } from '../config/layers/geographies-layer/geographies-layer';

export interface GeographiesInteractionOutput<Datum>
  extends GeographiesTooltipDatum<Datum> {
  origin: SVGPathElement;
  positionX: number;
  positionY: number;
  type: EventType;
}

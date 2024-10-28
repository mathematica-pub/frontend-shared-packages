import { DotsTooltipDatum } from '../dots.component';

export interface DotsEventOutput<Datum> extends DotsTooltipDatum<Datum> {
  origin: SVGCircleElement;
  positionX: number;
  positionY: number;
}

import { LinesTooltipDatum } from '../lines.component';

export interface LinesEventOutput<Datum> extends LinesTooltipDatum<Datum> {
  positionX: number;
  positionY: number;
}

import { LinesTooltipData } from '../lines.component';

export interface LinesEventOutput<Datum> extends LinesTooltipData<Datum> {
  positionX: number;
  positionY: number;
}

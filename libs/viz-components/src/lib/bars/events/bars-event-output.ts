import { DataValue } from '../../core/types/values';
import { BarsTooltipDatum } from '../bars.component';

export interface BarsEventOutput<Datum, OrdinalDomain extends DataValue>
  extends BarsTooltipDatum<Datum, OrdinalDomain> {
  origin: SVGRectElement;
  positionX: number;
  positionY: number;
}

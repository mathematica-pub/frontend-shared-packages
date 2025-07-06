import { DataValue } from '../../core/types/values';
import { EventType } from '../../events';
import { StackedBarsTooltipDatum } from '../stacked-bars.component';

export interface StackedBarsInteractionOutput<
  Datum,
  TOrdinalValue extends DataValue,
> extends StackedBarsTooltipDatum<Datum, TOrdinalValue> {
  origin: SVGRectElement;
  positionX: number;
  positionY: number;
  type: EventType;
}

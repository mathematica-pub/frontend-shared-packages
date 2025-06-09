import { DataValue } from '../../core/types/values';
import { EventType } from '../../events';
import { StackedAreaTooltipDatum } from '../stacked-area.component';

export interface StackedAreaInteractionOutput<
  Datum,
  TCategoricalValue extends DataValue,
> {
  data: StackedAreaTooltipDatum<Datum, TCategoricalValue>[];
  positionX: number;
  hoveredAreaTop: number;
  hoveredAreaBottom: number;
  hoveredDatum: StackedAreaTooltipDatum<Datum, TCategoricalValue>;
  svgHeight?: number;
  type: EventType;
}

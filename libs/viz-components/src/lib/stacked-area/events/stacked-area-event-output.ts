import { DataValue } from '../../core/types/values';
import { StackedAreaTooltipDatum } from '../stacked-area.component';

export interface StackedAreaEventOutput<
  Datum,
  TCategoricalValue extends DataValue,
> {
  data: StackedAreaTooltipDatum<Datum, TCategoricalValue>[];
  positionX: number;
  categoryYMin: number;
  categoryYMax: number;
  hoveredDatum: StackedAreaTooltipDatum<Datum, TCategoricalValue>;
  svgHeight?: number;
}

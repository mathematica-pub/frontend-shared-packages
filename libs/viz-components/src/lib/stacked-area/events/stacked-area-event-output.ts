import { DataValue } from '../../core/types/values';

export interface StackedAreaTooltipDatum<
  Datum,
  TCategoricalValue extends DataValue,
> {
  datum: Datum;
  color: string;
  x: string;
  y: string;
  category: TCategoricalValue;
}
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

import { DataValue } from '../../core/types/values';

export interface StackedAreaEventOutput<
  Datum,
  TCategoricalValue extends DataValue
> {
  data: StackedAreaTooltipData<Datum, TCategoricalValue>[];
  positionX: number;
  categoryYMin: number;
  categoryYMax: number;
  hoveredDatum: StackedAreaTooltipData<Datum, TCategoricalValue>;
  svgHeight?: number;
}

export interface StackedAreaTooltipData<
  Datum,
  TCategoricalValue extends DataValue
> {
  datum: Datum;
  color: string;
  x: string;
  y: string;
  category: TCategoricalValue;
}

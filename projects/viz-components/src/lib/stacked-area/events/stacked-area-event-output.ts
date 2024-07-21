import { DataValue } from '../../core/types/values';

export interface VicStackedAreaEventOutput<
  Datum,
  TCategoricalValue extends DataValue
> {
  data: VicStackedAreaTooltipData<Datum, TCategoricalValue>[];
  positionX: number;
  categoryYMin: number;
  categoryYMax: number;
  hoveredDatum: VicStackedAreaTooltipData<Datum, TCategoricalValue>;
  svgHeight?: number;
}

export interface VicStackedAreaTooltipData<
  Datum,
  TCategoricalValue extends DataValue
> {
  datum: Datum;
  color: string;
  x: string;
  y: string;
  category: TCategoricalValue;
}

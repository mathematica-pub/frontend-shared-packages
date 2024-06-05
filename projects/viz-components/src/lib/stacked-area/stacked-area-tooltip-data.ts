import { VicDataValue } from '../core/types/values';
import { ValueUtilities } from '../shared/value-utilities';
import { StackedAreaComponent } from './stacked-area.component';

export interface VicStackedAreaEventOutput<
  Datum,
  TCategoricalValue extends VicDataValue
> {
  data: VicStackedAreaEventDatum<Datum, TCategoricalValue>[];
  positionX: number;
  categoryYMin: number;
  categoryYMax: number;
  hoveredDatum: VicStackedAreaEventDatum<Datum, TCategoricalValue>;
  svgHeight?: number;
}

export interface VicStackedAreaEventDatum<
  Datum,
  TCategoricalValue extends VicDataValue
> {
  datum: Datum;
  color: string;
  x: string;
  y: string;
  category: TCategoricalValue;
}

export function getStackedAreaTooltipData<
  Datum,
  TCategoricalValue extends VicDataValue
>(
  closestXIndicies: number[],
  categoryYMin: number,
  categoryYMax: number,
  categoryIndex: number,
  stackedArea: StackedAreaComponent<Datum, TCategoricalValue>
): VicStackedAreaEventOutput<Datum, TCategoricalValue> {
  const data = closestXIndicies.map((i) => {
    const originalDatum = stackedArea.config.data.find(
      (d) =>
        stackedArea.config.x.valueAccessor(d) ===
          stackedArea.config.x.values[i] &&
        stackedArea.config.categorical.valueAccessor(d) ===
          stackedArea.config.categorical.values[i]
    );
    return {
      datum: originalDatum,
      x: ValueUtilities.formatValue(
        stackedArea.config.x.valueAccessor(originalDatum),
        stackedArea.config.x.valueFormat
      ),
      y: ValueUtilities.formatValue(
        stackedArea.config.y.valueAccessor(originalDatum),
        stackedArea.config.y.valueFormat
      ),
      category: stackedArea.config.categorical.valueAccessor(originalDatum),
      color: stackedArea.scales.categorical(
        stackedArea.config.categorical.valueAccessor(originalDatum)
      ),
    };
  });
  if (stackedArea.config.categoricalOrder) {
    data.sort((a, b) => {
      return (
        stackedArea.config.categoricalOrder.indexOf(a.category) -
        stackedArea.config.categoricalOrder.indexOf(b.category)
      );
    });
    categoryIndex = closestXIndicies.length - categoryIndex;
  }
  return {
    data,
    positionX: stackedArea.scales.x(
      stackedArea.config.x.values[closestXIndicies[0]]
    ),
    categoryYMin: categoryYMin,
    categoryYMax: categoryYMax,
    hoveredDatum: data[categoryIndex],
  };
}

import { VicDataValue } from '../data-marks/dimensions/data-dimension';
import { formatValue } from '../value-format/value-format';
import { StackedAreaComponent } from './stacked-area.component';

export interface VicStackedAreaEventOutput<Datum> {
  data: VicStackedAreaEventDatum<Datum>[];
  positionX: number;
  svgHeight?: number;
}

export interface VicStackedAreaEventDatum<Datum> {
  datum: Datum;
  color: string;
  x: string;
  y: string;
  category: VicDataValue;
}

export function getStackedAreaTooltipData<
  Datum,
  TCategoricalValue extends VicDataValue
>(
  closestXIndicies: number[],
  stackedArea: StackedAreaComponent<Datum, TCategoricalValue>
): VicStackedAreaEventOutput<Datum> {
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
      x: formatValue(
        stackedArea.config.x.valueAccessor(originalDatum),
        stackedArea.config.x.valueFormat
      ),
      y: formatValue(
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
  }
  return {
    data,
    positionX: stackedArea.scales.x(
      stackedArea.config.x.values[closestXIndicies[0]]
    ),
  };
}

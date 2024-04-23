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
        stackedArea.config.category.valueAccessor(d) ===
          stackedArea.config.category.values[i]
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
      category: stackedArea.config.category.valueAccessor(originalDatum),
      color: stackedArea.scales.category(
        stackedArea.config.category.valueAccessor(originalDatum)
      ),
    };
  });
  if (stackedArea.config.categoryOrder) {
    data.sort((a, b) => {
      return (
        stackedArea.config.categoryOrder.indexOf(a.category) -
        stackedArea.config.categoryOrder.indexOf(b.category)
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

import { formatValue } from '../value-format/value-format';
import { StackedAreaComponent } from './stacked-area.component';

export interface VicStackedAreaEventOutput<Datum> {
  data: VicStackedAreaEventDatum<Datum>[];
  positionX: number;
  categoryYMin: number;
  categoryYMax: number;
  hoveredDatum: VicStackedAreaEventDatum<Datum>;
  svgHeight?: number;
}

export interface VicStackedAreaEventDatum<Datum> {
  datum: Datum;
  color: string;
  x: string;
  y: string;
  category: string;
}

export function getStackedAreaTooltipData<Datum>(
  closestXIndicies: number[],
  categoryYMin: number,
  categoryYMax: number,
  categoryIndex: number,
  stackedArea: StackedAreaComponent<Datum>
): VicStackedAreaEventOutput<Datum> {
  const data = closestXIndicies.map((i) => {
    const originalDatum = stackedArea.config.data.find(
      (d) =>
        stackedArea.config.x.valueAccessor(d) === stackedArea.values.x[i] &&
        stackedArea.config.category.valueAccessor(d) ===
          stackedArea.values.category[i]
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
    categoryIndex = closestXIndicies.length - categoryIndex;
  }
  return {
    data,
    positionX: stackedArea.scales.x(stackedArea.values.x[closestXIndicies[0]]),
    categoryYMin: categoryYMin,
    categoryYMax: categoryYMax,
    hoveredDatum: data[categoryIndex],
  };
}

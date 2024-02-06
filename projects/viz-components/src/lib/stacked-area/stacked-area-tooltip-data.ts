import { formatValue } from '../value-format/value-format';
import { StackedAreaComponent } from './stacked-area.component';

export interface VicStackedAreaEventOutput {
  data: VicStackedAreaEventDatum[];
  positionX: number;
  svgHeight?: number;
}

export interface VicStackedAreaEventDatum {
  datum: any[];
  color: string;
  x: string;
  y: string;
  category: string;
}

export function getStackedAreaTooltipData(
  closestXIndicies: number[],
  stackedArea: StackedAreaComponent
): VicStackedAreaEventOutput {
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
  }
  return {
    data,
    positionX: stackedArea.scales.x(stackedArea.values.x[closestXIndicies[0]]),
  };
}

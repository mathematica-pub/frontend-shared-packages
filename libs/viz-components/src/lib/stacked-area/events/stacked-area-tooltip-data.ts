import { AbstractConstructor } from '../../core/common-behaviors/constructor';
import { DataValue } from '../../core/types/values';
import { ValueUtilities } from '../../core/utilities/values';
import { StackedAreaComponent } from '../stacked-area.component';
import { StackedAreaEventOutput } from './stacked-area-event-output';

export interface StackedAreaTooltip {
  getStackedAreaTooltipData<Datum, TCategoricalValue extends DataValue>(
    closestXIndicies: number[],
    categoryYMin: number,
    categoryYMax: number,
    categoryIndex: number,
    stackedArea: StackedAreaComponent<Datum, TCategoricalValue>
  ): StackedAreaEventOutput<Datum, TCategoricalValue>;
}

// TODO: have this extend a specific class so that we don't need to pass everything in as an argument
export function stackedAreaTooltipMixin<T extends AbstractConstructor>(
  Base: T
) {
  abstract class Mixin extends Base implements StackedAreaTooltip {
    getStackedAreaTooltipData<Datum, TCategoricalValue extends DataValue>(
      closestXIndicies: number[],
      categoryYMin: number,
      categoryYMax: number,
      categoryIndex: number,
      stackedArea: StackedAreaComponent<Datum, TCategoricalValue>
    ): StackedAreaEventOutput<Datum, TCategoricalValue> {
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
          x: stackedArea.config.x.formatFunction
            ? ValueUtilities.customFormat(
                originalDatum,
                stackedArea.config.x.formatFunction
              )
            : ValueUtilities.d3Format(
                stackedArea.config.x.valueAccessor(originalDatum),
                stackedArea.config.x.formatSpecifier
              ),
          y: stackedArea.config.y.formatFunction
            ? ValueUtilities.customFormat(
                originalDatum,
                stackedArea.config.y.formatFunction
              )
            : ValueUtilities.d3Format(
                stackedArea.config.y.valueAccessor(originalDatum),
                stackedArea.config.y.formatSpecifier
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
  }
  return Mixin;
}

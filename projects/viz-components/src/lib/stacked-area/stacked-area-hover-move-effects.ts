import { EventEffect } from '../events/effect';
import { formatValue } from '../value-format/value-format';
import {
  StackedAreaEmittedOutput,
  StackedAreaHoverAndMoveEventDirective,
} from './stacked-area-hover-move-event.directive';

export class EmitStackedAreaTooltipData
  implements EventEffect<StackedAreaHoverAndMoveEventDirective>
{
  applyEffect(directive: StackedAreaHoverAndMoveEventDirective): void {
    const tt = {} as StackedAreaEmittedOutput;
    const data = directive.closestXIndicies.map((i) => {
      const originalDatum = directive.stackedArea.config.data.find(
        (d) =>
          directive.stackedArea.config.x.valueAccessor(d) ===
            directive.stackedArea.values.x[i] &&
          directive.stackedArea.config.category.valueAccessor(d) ===
            directive.stackedArea.values.category[i]
      );
      return {
        datum: originalDatum,
        x: formatValue(
          directive.stackedArea.config.x.valueAccessor(originalDatum),
          directive.stackedArea.config.x.valueFormat
        ),
        y: formatValue(
          directive.stackedArea.config.y.valueAccessor(originalDatum),
          directive.stackedArea.config.y.valueFormat
        ),
        category:
          directive.stackedArea.config.category.valueAccessor(originalDatum),
        color: directive.stackedArea.categoryScale(
          directive.stackedArea.config.category.valueAccessor(originalDatum)
        ),
      };
    });
    if (directive.stackedArea.config.categoryOrder) {
      data.sort((a, b) => {
        return (
          directive.stackedArea.config.categoryOrder.indexOf(a.category) -
          directive.stackedArea.config.categoryOrder.indexOf(b.category)
        );
      });
    }
    tt.positionX = directive.stackedArea.xScale(
      directive.stackedArea.values.x[directive.closestXIndicies[0]]
    );
    tt.data = data;
    tt.svgHeight = directive.elements[0].clientHeight;
    directive.hoverAndMoveEventOutput.emit(tt);
  }

  removeEffect(event: StackedAreaHoverAndMoveEventDirective): void {
    event.hoverAndMoveEventOutput.emit(null);
  }
}

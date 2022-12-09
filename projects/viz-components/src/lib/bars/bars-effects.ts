import { EventEffect } from '../events/effect';
import { BarsHoverEventDirective } from './bars-hover-event.directive';
import {
  BarsHoverAndMoveEmittedOutput,
  BarsHoverAndMoveEventDirective,
} from './bars-hover-move-event.directive';
export class EmitBarsHoverAndMoveTooltipData
  implements EventEffect<BarsHoverAndMoveEventDirective>
{
  applyEffect(directive: BarsHoverAndMoveEventDirective): void {
    const datum = directive.bars.config.data.find(
      (d) =>
        directive.bars.values[directive.bars.config.dimensions.quantitative][
          directive.barIndex
        ] === directive.bars.config.quantitative.valueAccessor(d) &&
        directive.bars.values[directive.bars.config.dimensions.ordinal][
          directive.barIndex
        ] === directive.bars.config.ordinal.valueAccessor(d)
    );

    const tooltipData: BarsHoverAndMoveEmittedOutput = {
      datum,
      color: directive.bars.getBarColor(directive.barIndex),
      ordinal: directive.bars.config.ordinal.valueAccessor(datum),
      quantitative: directive.bars.config.quantitative.valueAccessor(datum),
      category: directive.bars.config.category.valueAccessor(datum),
      elRef: directive.elRef,
      positionX: directive.pointerX,
      positionY: directive.pointerY,
    };

    directive.hoverAndMoveEventOutput.emit(tooltipData);
  }

  removeEffect(directive: BarsHoverAndMoveEventDirective): void {
    directive.hoverAndMoveEventOutput.emit(null);
    console.log('removeEffect');
  }
}

export class ShowBarsLabelsOnHover
  implements EventEffect<BarsHoverEventDirective>
{
  applyEffect(directive: BarsHoverEventDirective): void {
    directive.bars.barGroups
      .filter((d) => d === directive.barIndex)
      .select('text')
      .style('display', null);
  }

  removeEffect(directive: BarsHoverEventDirective): void {
    directive.bars.barGroups
      .filter((d) => d === directive.barIndex)
      .select('text')
      .style('display', 'none');
  }
}

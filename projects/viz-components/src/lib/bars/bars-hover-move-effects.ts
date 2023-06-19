import { EventEffect } from '../events/effect';
import { BarsHoverAndMoveEventDirective } from './bars-hover-move-event.directive';

export class BarsHoverAndMoveEffectEmitTooltipData
  implements EventEffect<BarsHoverAndMoveEventDirective>
{
  applyEffect(directive: BarsHoverAndMoveEventDirective): void {
    const tooltipData = directive.getTooltipData();
    directive.eventOutput.emit(tooltipData);
  }

  removeEffect(directive: BarsHoverAndMoveEventDirective): void {
    directive.eventOutput.emit(null);
  }
}

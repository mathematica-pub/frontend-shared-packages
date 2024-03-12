import { HoverMoveEventEffect } from '../events/effect';
import { BarsHoverMoveDirective } from './bars-hover-move.directive';

export class BarsHoverMoveEmitTooltipData<Datum>
  implements HoverMoveEventEffect<BarsHoverMoveDirective<Datum>>
{
  applyEffect(directive: BarsHoverMoveDirective<Datum>): void {
    const tooltipData = directive.getEventOutput();
    directive.eventOutput.emit(tooltipData);
  }

  removeEffect(directive: BarsHoverMoveDirective<Datum>): void {
    directive.eventOutput.emit(null);
  }
}

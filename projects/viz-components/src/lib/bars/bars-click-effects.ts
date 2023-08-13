import { EventEffect } from '../events/effect';
import { BarsClickDirective } from './bars-click.directive';

export class BarsClickEmitTooltipDataPauseHoverMoveEffects
  implements EventEffect<BarsClickDirective>
{
  applyEffect(directive: BarsClickDirective) {
    const outputData = directive.getEventOutput();
    directive.preventHoverEffects();
    directive.eventOutput.emit(outputData);
  }

  removeEffect(directive: BarsClickDirective) {
    directive.resumeHoverEffects();
    directive.eventOutput.emit(null);
  }
}

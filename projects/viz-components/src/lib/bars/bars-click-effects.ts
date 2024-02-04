import { EventEffect } from '../events/effect';
import { BarsClickDirective } from './bars-click.directive';

export class BarsClickEmitTooltipDataPauseHoverMoveEffects<T>
  implements EventEffect<BarsClickDirective<T>>
{
  applyEffect(directive: BarsClickDirective<T>) {
    const outputData = directive.getEventOutput();
    directive.preventHoverEffects();
    directive.eventOutput.emit(outputData);
  }

  removeEffect(directive: BarsClickDirective<T>) {
    directive.resumeHoverEffects();
    directive.eventOutput.emit(null);
  }
}

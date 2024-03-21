import { EventEffect } from '../events/effect';
import { BarsClickDirective } from './bars-click.directive';

export class BarsClickEmitTooltipDataPauseHoverMoveEffects<Datum>
  implements EventEffect<BarsClickDirective<Datum>>
{
  applyEffect(directive: BarsClickDirective<Datum>) {
    const outputData = directive.getEventOutput();
    directive.preventHoverEffects();
    directive.eventOutput.emit(outputData);
  }

  removeEffect(directive: BarsClickDirective<Datum>) {
    directive.resumeHoverEffects();
    directive.eventOutput.emit(null);
  }
}

import { EventEffect } from '../events/effect';
import { BarsClickDirective } from './bars-click.directive';

export class BarsClickEmitTooltipDataPauseHoverMoveEffects
  implements EventEffect<BarsClickDirective>
{
  applyEffect(directive: BarsClickDirective) {
    const tooltipData = directive.getTooltipData();
    directive.preventHoverEffects();
    directive.eventOutput.emit(tooltipData);
  }

  removeEffect(directive: BarsClickDirective) {
    directive.resumeHoverEffects();
    directive.eventOutput.emit(null);
  }
}

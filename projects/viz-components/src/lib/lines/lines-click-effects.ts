import { EventEffect } from '../events/effect';
import { LinesClickDirective } from './lines-click.directive';

export class LinesClickEmitTooltipDataPauseHoverMoveEffects
  implements EventEffect<LinesClickDirective>
{
  applyEffect(directive: LinesClickDirective) {
    const tooltipData = directive.getTooltipData();
    directive.preventHoverEffects();
    directive.eventOutput.emit(tooltipData);
  }

  removeEffect(directive: LinesClickDirective) {
    directive.resumeHoverEffects(false);
    directive.eventOutput.emit(null);
  }
}

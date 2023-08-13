import { EventEffect } from '../events/effect';
import { LinesClickDirective } from './lines-click.directive';

export class LinesClickEmitTooltipDataPauseHoverMoveEffects
  implements EventEffect<LinesClickDirective>
{
  applyEffect(directive: LinesClickDirective) {
    const outputData = directive.getOutputData();
    directive.preventHoverEffects();
    directive.eventOutput.emit(outputData);
  }

  removeEffect(directive: LinesClickDirective) {
    directive.resumeHoverEffects();
    directive.eventOutput.emit(null);
  }
}

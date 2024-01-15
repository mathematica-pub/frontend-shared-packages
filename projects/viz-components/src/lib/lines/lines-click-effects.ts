import { EventEffect } from '../events/effect';
import { LinesClickDirective } from './lines-click.directive';
import { LinesComponent } from './lines.component';

export class LinesClickEmitTooltipDataPauseHoverMoveEffects<
  T,
  U extends LinesComponent<T> = LinesComponent<T>
> implements EventEffect<LinesClickDirective<T, U>>
{
  applyEffect(directive: LinesClickDirective<T, U>) {
    const outputData = directive.getOutputData();
    directive.preventHoverEffects();
    directive.eventOutput.emit(outputData);
  }

  removeEffect(directive: LinesClickDirective<T, U>) {
    directive.resumeHoverEffects();
    directive.eventOutput.emit(null);
  }
}

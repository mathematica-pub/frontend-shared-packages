import { EventEffect } from '../events/effect';
import { LinesClickDirective } from './lines-click.directive';
import { LinesComponent } from './lines.component';

export class LinesClickEmitTooltipDataPauseHoverMoveEffects<
  Datum,
  ExtendedLinesComponent extends LinesComponent<Datum> = LinesComponent<Datum>,
> implements EventEffect<LinesClickDirective<Datum, ExtendedLinesComponent>>
{
  applyEffect(directive: LinesClickDirective<Datum, ExtendedLinesComponent>) {
    const outputData = directive.getOutputData();
    directive.preventHoverEffects();
    directive.eventOutput.emit(outputData);
  }

  removeEffect(directive: LinesClickDirective<Datum, ExtendedLinesComponent>) {
    directive.resumeHoverEffects();
    directive.eventOutput.emit(null);
  }
}

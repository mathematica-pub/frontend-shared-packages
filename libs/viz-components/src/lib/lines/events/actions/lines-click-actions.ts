import { EventAction } from '../../../events/action';
import { LinesComponent } from '../../lines.component';
import { LinesClickDirective } from '../lines-click.directive';

export class LinesClickEmitTooltipDataPauseHoverMoveActions<
  Datum,
  ExtendedLinesComponent extends LinesComponent<Datum> = LinesComponent<Datum>,
> implements EventAction<LinesClickDirective<Datum, ExtendedLinesComponent>>
{
  onStart(directive: LinesClickDirective<Datum, ExtendedLinesComponent>) {
    const outputData = directive.getOutputData();
    directive.preventHoverActions();
    directive.eventOutput.emit(outputData);
  }

  onEnd(directive: LinesClickDirective<Datum, ExtendedLinesComponent>) {
    directive.resumeHoverActions();
    directive.eventOutput.emit(null);
  }
}

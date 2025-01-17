import { DataValue } from '../../../core/types/values';
import { EventAction } from '../../../events/action';
import { StackedBarsClickDirective } from '../stacked-bars-click.directive';

export class StackedBarsClickEmitTooltipDataPauseHoverMoveActions<
  Datum,
  TOrdinalValue extends DataValue,
> implements EventAction<StackedBarsClickDirective<Datum, TOrdinalValue>>
{
  onStart(directive: StackedBarsClickDirective<Datum, TOrdinalValue>) {
    const outputData = directive.getEventOutput();
    directive.disableHoverActions();
    directive.eventOutput.emit(outputData);
  }

  onEnd(directive: StackedBarsClickDirective<Datum, TOrdinalValue>) {
    directive.resumeHoverActions();
    directive.eventOutput.emit(null);
  }
}

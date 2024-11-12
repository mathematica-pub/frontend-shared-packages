import { DataValue } from '../../../core/types/values';
import { EventAction } from '../../../events/action';
import { BarsClickDirective } from '../bars-click.directive';

export class BarsClickEmitTooltipDataPauseHoverMoveActions<
  Datum,
  TOrdinalValue extends DataValue,
> implements EventAction<BarsClickDirective<Datum, TOrdinalValue>>
{
  onStart(directive: BarsClickDirective<Datum, TOrdinalValue>) {
    const outputData = directive.getEventOutput();
    directive.disableHoverActions();
    directive.eventOutput.emit(outputData);
  }

  onEnd(directive: BarsClickDirective<Datum, TOrdinalValue>) {
    directive.resumeHoverActions();
    directive.eventOutput.emit(null);
  }
}

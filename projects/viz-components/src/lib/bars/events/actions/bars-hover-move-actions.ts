import { DataValue } from '../../../core/types/values';
import { HoverMoveAction } from '../../../events/action';
import { BarsHoverMoveDirective } from '../bars-hover-move.directive';

export class BarsHoverMoveEmitTooltipData<
  Datum,
  TOrdinalValue extends DataValue,
> implements HoverMoveAction<BarsHoverMoveDirective<Datum, TOrdinalValue>>
{
  onStart(directive: BarsHoverMoveDirective<Datum, TOrdinalValue>): void {
    const tooltipData = directive.getEventOutput();
    directive.eventOutput.emit(tooltipData);
  }

  onEnd(directive: BarsHoverMoveDirective<Datum, TOrdinalValue>): void {
    directive.eventOutput.emit(null);
  }
}

import { DataValue } from '../../../core/types/values';
import { HoverMoveAction } from '../../../events/action';
import { StackedBarsHoverMoveDirective } from '../stacked-bars-hover-move.directive';

export class StackedBarsHoverMoveEmitTooltipData<
  Datum,
  TOrdinalValue extends DataValue,
> implements
    HoverMoveAction<StackedBarsHoverMoveDirective<Datum, TOrdinalValue>>
{
  onStart(
    directive: StackedBarsHoverMoveDirective<Datum, TOrdinalValue>
  ): void {
    const tooltipData = directive.getEventOutput();
    directive.eventOutput.emit(tooltipData);
  }

  onEnd(directive: StackedBarsHoverMoveDirective<Datum, TOrdinalValue>): void {
    directive.eventOutput.emit(null);
  }
}

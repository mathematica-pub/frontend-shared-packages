import { DataValue } from '../../../core/types/values';
import { EventAction } from '../../../events/action';
import { StackedBarsHoverDirective } from '../stacked-bars-hover.directive';
export class StackedBarsHoverEmitTooltipData<
  Datum,
  TOrdinalValue extends DataValue,
> implements EventAction<StackedBarsHoverDirective<Datum, TOrdinalValue>>
{
  onStart(directive: StackedBarsHoverDirective<Datum, TOrdinalValue>): void {
    const tooltipData = directive.getEventOutput();
    directive.eventOutput.emit(tooltipData);
  }

  onEnd(directive: StackedBarsHoverDirective<Datum, TOrdinalValue>): void {
    directive.eventOutput.emit(null);
  }
}

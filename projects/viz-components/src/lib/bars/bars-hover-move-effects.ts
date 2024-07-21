import { DataValue } from '../core/types/values';
import { HoverMoveEventEffect } from '../events/effect';
import { BarsHoverMoveDirective } from './bars-hover-move.directive';

export class BarsHoverMoveEmitTooltipData<
  Datum,
  TOrdinalValue extends DataValue
> implements HoverMoveEventEffect<BarsHoverMoveDirective<Datum, TOrdinalValue>>
{
  applyEffect(directive: BarsHoverMoveDirective<Datum, TOrdinalValue>): void {
    const tooltipData = directive.getEventOutput();
    directive.eventOutput.emit(tooltipData);
  }

  removeEffect(directive: BarsHoverMoveDirective<Datum, TOrdinalValue>): void {
    directive.eventOutput.emit(null);
  }
}

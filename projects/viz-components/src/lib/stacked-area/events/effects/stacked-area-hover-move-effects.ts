import { DataValue } from '../../../core/types/values';
import { HoverMoveEventEffect } from '../../../events/effect';
import { StackedAreaComponent } from '../../stacked-area.component';
import { StackedAreaHoverMoveDirective } from '../stacked-area-hover-move.directive';

export class StackedAreaHoverMoveEmitTooltipData<
  Datum,
  TCategoricalValue extends DataValue,
  TStackedAreaComponent extends StackedAreaComponent<
    Datum,
    TCategoricalValue
  > = StackedAreaComponent<Datum, TCategoricalValue>,
> implements
    HoverMoveEventEffect<
      StackedAreaHoverMoveDirective<
        Datum,
        TCategoricalValue,
        TStackedAreaComponent
      >
    >
{
  applyEffect(
    directive: StackedAreaHoverMoveDirective<
      Datum,
      TCategoricalValue,
      TStackedAreaComponent
    >
  ): void {
    const tooltipData = directive.getTooltipData();
    directive.eventOutput.emit(tooltipData);
  }

  removeEffect(
    event: StackedAreaHoverMoveDirective<
      Datum,
      TCategoricalValue,
      TStackedAreaComponent
    >
  ): void {
    event.eventOutput.emit(null);
  }
}

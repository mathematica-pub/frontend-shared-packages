import { DataValue } from '../../../core/types/values';
import { HoverMoveAction } from '../../../events/action';
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
    HoverMoveAction<
      StackedAreaHoverMoveDirective<
        Datum,
        TCategoricalValue,
        TStackedAreaComponent
      >
    >
{
  onStart(
    directive: StackedAreaHoverMoveDirective<
      Datum,
      TCategoricalValue,
      TStackedAreaComponent
    >
  ): void {
    const tooltipData = directive.getTooltipData();
    directive.eventOutput.emit(tooltipData);
  }

  onEnd(
    event: StackedAreaHoverMoveDirective<
      Datum,
      TCategoricalValue,
      TStackedAreaComponent
    >
  ): void {
    event.eventOutput.emit(null);
  }
}

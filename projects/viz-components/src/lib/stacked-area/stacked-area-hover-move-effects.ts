import { HoverMoveEventEffect } from '../events/effect';
import { StackedAreaHoverMoveDirective } from './stacked-area-hover-move.directive';
import { StackedAreaComponent } from './stacked-area.component';

export class StackedAreaHoverMoveEmitTooltipData<
  Datum,
  ExtendedStackedAreaComponent extends StackedAreaComponent<Datum> = StackedAreaComponent<Datum>
> implements
    HoverMoveEventEffect<
      StackedAreaHoverMoveDirective<Datum, ExtendedStackedAreaComponent>
    >
{
  applyEffect(
    directive: StackedAreaHoverMoveDirective<
      Datum,
      ExtendedStackedAreaComponent
    >
  ): void {
    const tooltipData = directive.getTooltipData();
    directive.eventOutput.emit(tooltipData);
  }

  removeEffect(
    event: StackedAreaHoverMoveDirective<Datum, ExtendedStackedAreaComponent>
  ): void {
    event.eventOutput.emit(null);
  }
}

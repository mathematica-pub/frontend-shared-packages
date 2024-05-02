import { VicDataValue } from '../data-marks/dimensions/data-dimension';
import { HoverMoveEventEffect } from '../events/effect';
import { StackedAreaHoverMoveDirective } from './stacked-area-hover-move.directive';
import { StackedAreaComponent } from './stacked-area.component';

export class StackedAreaHoverMoveEmitTooltipData<
  Datum,
  TCategoricalValue extends VicDataValue,
  TStackedAreaComponent extends StackedAreaComponent<
    Datum,
    TCategoricalValue
  > = StackedAreaComponent<Datum, TCategoricalValue>
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

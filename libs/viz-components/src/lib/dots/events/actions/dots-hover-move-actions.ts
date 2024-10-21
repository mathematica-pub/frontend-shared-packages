import { HoverMoveAction } from '../../../events';
import { DotsComponent } from '../../dots.component';
import { DotsHoverMoveDirective } from '../dots-hover-move.directive';

export class DotsHoverMoveDefaultStyles<
  Datum,
  TDotsComponent extends DotsComponent<Datum> = DotsComponent<Datum>,
> implements HoverMoveAction<DotsHoverMoveDirective<Datum, TDotsComponent>>
{
  onStart(directive: DotsHoverMoveDirective<Datum, TDotsComponent>): void {
    directive.dots.dotGroups
      .filter((d) => d.index !== directive.dotDatum.index)
      .selectAll<SVGCircleElement, number>('circle')
      .style('fill', '#ccc');
  }

  onEnd(directive: DotsHoverMoveDirective<Datum, TDotsComponent>): void {
    directive.dots.dotGroups
      .selectAll<SVGCircleElement, number>('circle')
      .style('fill', null);
  }
}

export class DotsHoverMoveEmitTooltipData<
  Datum,
  TDotsComponent extends DotsComponent<Datum> = DotsComponent<Datum>,
> implements HoverMoveAction<DotsHoverMoveDirective<Datum, TDotsComponent>>
{
  onStart(directive: DotsHoverMoveDirective<Datum, TDotsComponent>): void {
    const tooltipData = directive.getEventOutput();
    directive.eventOutput.emit(tooltipData);
  }

  onEnd(directive: DotsHoverMoveDirective<Datum, TDotsComponent>): void {
    directive.eventOutput.emit(null);
  }
}

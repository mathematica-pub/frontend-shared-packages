import { EventAction } from '../../../events';
import { DotsComponent } from '../../dots.component';
import { DotsHoverDirective } from '../dots-hover.directive';

export class DotsHoverDefaultStyles<
  Datum,
  TDotsComponent extends DotsComponent<Datum> = DotsComponent<Datum>,
> implements EventAction<DotsHoverDirective<Datum, TDotsComponent>>
{
  onStart(directive: DotsHoverDirective<Datum, TDotsComponent>): void {
    directive.dots.dotGroups
      .filter((d) => d.index !== directive.dotDatum.index)
      .selectAll<SVGCircleElement, number>('circle')
      .style('fill', '#ccc');
  }

  onEnd(directive: DotsHoverDirective<Datum, TDotsComponent>): void {
    directive.dots.dotGroups
      .selectAll<SVGCircleElement, number>('circle')
      .style('fill', null);
  }
}

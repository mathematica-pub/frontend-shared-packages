import { EventType, HoverMoveAction } from '../../../events';
import { DotsHost } from '../dots-events.directive';

export class DotsHoverMoveDefaultStyles<Datum>
  implements HoverMoveAction<DotsHost<Datum>>
{
  onStart(host: DotsHost<Datum>): void {
    host.marks.dotGroups
      .filter((d) => d.index !== host.getDotDatum().index)
      .selectAll<SVGCircleElement, number>('circle')
      .style('fill', '#ccc');

    host.marks.dotGroups
      .filter((d) => d.index === host.getDotDatum().index)
      .selectAll<SVGCircleElement, number>('circle')
      .select((d, i, nodes) => nodes[i].parentElement)
      .raise();
  }

  onEnd(host: DotsHost<Datum>): void {
    host.marks.dotGroups
      .selectAll<SVGCircleElement, number>('circle')
      .style('fill', null);
  }
}

export class DotsHoverMoveEmitTooltipData<Datum>
  implements HoverMoveAction<DotsHost<Datum>>
{
  onStart(host: DotsHost<Datum>): void {
    const tooltipData = host.getInteractionOutput(EventType.HoverMove);
    host.emitInteractionOutput(tooltipData);
  }

  onEnd(host: DotsHost<Datum>): void {
    host.emitInteractionOutput(null);
  }
}

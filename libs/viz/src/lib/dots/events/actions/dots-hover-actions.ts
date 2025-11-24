import { EventAction } from '../../../events';
import { DotsHost } from '../dots-events.directive';

export class DotsHoverDefaultStyles<Datum>
  implements EventAction<DotsHost<Datum>>
{
  onStart(host: DotsHost<Datum>): void {
    host.marks.dotGroups
      .filter((d) => d.index !== host.getDotDatum().index)
      .selectAll<SVGCircleElement, number>('circle')
      .style('fill', '#ccc');
  }

  onEnd(host: DotsHost<Datum>): void {
    host.marks.dotGroups
      .selectAll<SVGCircleElement, number>('circle')
      .style('fill', null);
  }
}

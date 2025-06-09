import { select } from 'd3';
import { EventType, RefactorEventAction } from '../../../events';
import { LinesMarkersHost } from '../lines-markers-events.directive';

export class RefactorLinesMarkerClickEmitTooltipData<Datum>
  implements RefactorEventAction<LinesMarkersHost<Datum>>
{
  onStart(host: LinesMarkersHost<Datum>) {
    const tooltipData = host.getInteractionOutput(EventType.Click);
    host.disableOtherActions(EventType.Click);
    select(host.getOrigin())
      .attr('r', (): number => {
        const r =
          host.marks.config.pointMarkers.radius +
          host.marks.config.pointMarkers.growByOnHover;
        return r;
      })
      .raise();
    host.emitInteractionOutput(tooltipData);
  }

  onEnd(host: LinesMarkersHost<Datum>) {
    select(host.getOrigin()).attr(
      'r',
      (): number => host.marks.config.pointMarkers.radius
    );
    host.resumeOtherActions(EventType.Click);
    host.emitInteractionOutput(null);
  }
}

import { EventType, RefactorEventAction } from '../../../events';
import { LinesHost } from '../lines-events.directive';

export class LinesMarkerClickEmitTooltipData<Datum>
  implements RefactorEventAction<LinesHost<Datum>>
{
  onStart(host: LinesHost<Datum>) {
    const tooltipData = host.getInteractionOutput(EventType.Click);
    host.disableOtherActions(EventType.Click);
    host
      .getClosestMarker()
      .attr('r', (): number => {
        const r =
          host.marks.config.pointMarkers.radius +
          host.marks.config.pointMarkers.growByOnHover;
        return r;
      })
      .raise();
    host.emitInteractionOutput(tooltipData);
  }

  onEnd(host: LinesHost<Datum>) {
    host
      .getClosestMarker()
      .attr('r', (): number => host.marks.config.pointMarkers.radius);
    host.resumeOtherActions(EventType.Click);
    host.emitInteractionOutput(null);
  }
}

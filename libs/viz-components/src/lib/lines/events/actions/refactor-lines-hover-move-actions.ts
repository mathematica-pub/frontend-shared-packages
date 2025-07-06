import { EventType, RefactorEventAction } from '../../../events';
import { LinesMarkerDatum } from '../../config/lines-config';
import { LinesGroupSelectionDatum } from '../../lines.component';
import { LinesHost } from '../lines-events.directive';

/**
 * A suggested default action for the hover and move event on lines.
 *
 * This action changes the color of the non-closest-to-pointer lines
 *  to a light gray.
 */
export class RefactorLinesHoverMoveDefaultLinesStyles<Datum>
  implements RefactorEventAction<LinesHost<Datum>>
{
  onStart(host: LinesHost<Datum>): void {
    host.marks.lineGroups
      .filter(
        ([category]) =>
          host.marks.config.stroke.color.values[host.getClosestPointIndex()] ===
          category
      )
      .raise()
      .selectAll<SVGPathElement, LinesGroupSelectionDatum>('path')
      .style('stroke', null);

    host.marks.lineGroups
      .filter(
        ([category]) =>
          host.marks.config.stroke.color.values[host.getClosestPointIndex()] !==
          category
      )
      .selectAll<SVGPathElement, LinesGroupSelectionDatum>('path')
      .style('stroke', '#ddd');
  }

  onEnd(directive: LinesHost<Datum>): void {
    directive.marks.lineGroups
      .selectAll<SVGPathElement, LinesGroupSelectionDatum>('path')
      .style('stroke', null);
  }
}

/**
 * A suggested default action for the hover and move event on line markers.
 *
 * This action makes line markers on non-closest-to-pointer lines invisible,
 *  and at the same time enlarges the marker on the "selected" line that is
 *  closest to the pointer by a specified amount.
 */
export class RefactorLinesHoverMoveDefaultMarkersStyles<Datum>
  implements RefactorEventAction<LinesHost<Datum>>
{
  onStart(host: LinesHost<Datum>): void {
    host.marks.lineGroups
      .filter(
        ([category]) =>
          host.marks.config.stroke.color.values[host.getClosestPointIndex()] ===
          category
      )
      .selectAll<SVGCircleElement, LinesMarkerDatum>('circle')
      .style('display', (d) =>
        host.getClosestPointIndex() === d.index ? 'block' : 'none'
      )
      .attr('r', (d) => {
        let r = host.marks.config.pointMarkers.radius;
        if (host.getClosestPointIndex() === d.index) {
          r =
            host.marks.config.pointMarkers.radius +
            host.marks.config.pointMarkers.growByOnHover;
        }
        return r;
      })
      .raise();

    host.marks.lineGroups
      .filter(
        ([category]) =>
          host.marks.config.stroke.color.values[host.getClosestPointIndex()] !==
          category
      )
      .selectAll<SVGCircleElement, LinesMarkerDatum>('circle')
      .style('display', 'none');
  }

  onEnd(host: LinesHost<Datum>): void {
    host.marks.lineGroups
      .selectAll<SVGCircleElement, LinesMarkerDatum>('circle')
      .style('display', (d) => d.display)
      .attr('r', () => host.marks.config.pointMarkers.radius);
  }
}

/**
 * A collection of suggested default actions for the hover and move event
 *  on lines and line markers.
 *
 * Applies either Line Markers action or a Hover Dot action depending on
 *  whether line markers are used.
 */
export class RefactorLinesHoverMoveDefaultStyles<Datum>
  implements RefactorEventAction<LinesHost<Datum>>
{
  linesStyles: RefactorEventAction<LinesHost<Datum>>;
  markersStyles: RefactorEventAction<LinesHost<Datum>>;

  constructor() {
    this.linesStyles = new RefactorLinesHoverMoveDefaultLinesStyles();
    this.markersStyles = new RefactorLinesHoverMoveDefaultMarkersStyles();
  }

  onStart(host: LinesHost<Datum>) {
    this.linesStyles.onStart(host);
    if (host.marks.config.pointMarkers) {
      this.markersStyles.onStart(host);
    }
  }

  onEnd(host: LinesHost<Datum>) {
    this.linesStyles.onEnd(host);
    if (host.marks.config.pointMarkers) {
      this.markersStyles.onEnd(host);
    }
  }
}

export class RefactorLinesHoverMoveEmitTooltipData<Datum>
  implements RefactorEventAction<LinesHost<Datum>>
{
  onStart(host: LinesHost<Datum>): void {
    const tooltipData = host.getInteractionOutput(EventType.HoverMove);
    host.emitInteractionOutput(tooltipData);
  }

  onEnd(host: LinesHost<Datum>): void {
    host.emitInteractionOutput(null);
  }
}

import { select } from 'd3';
import { HoverMoveAction } from '../../../events/action';
import { LinesMarkerDatum } from '../../config/lines-config';
import {
  LinesComponent,
  LinesGroupSelectionDatum,
} from '../../lines.component';
import { LinesHoverMoveDirective } from '../lines-hover-move.directive';

/**
 * A suggested default action for the hover and move event on lines.
 *
 * This action changes the color of the non-closest-to-pointer lines
 *  to a light gray.
 */
export class LinesHoverMoveDefaultLinesStyles<
  Datum,
  TLinesComponent extends LinesComponent<Datum> = LinesComponent<Datum>,
> implements HoverMoveAction<LinesHoverMoveDirective<Datum, TLinesComponent>>
{
  onStart(directive: LinesHoverMoveDirective<Datum, TLinesComponent>): void {
    directive.lines.lineGroups
      .filter(
        ([category]) =>
          directive.lines.config.categorical.values[
            directive.closestPointIndex
          ] === category
      )
      .raise()
      .selectAll<SVGPathElement, LinesGroupSelectionDatum>('path')
      .style('stroke', null);

    directive.lines.lineGroups
      .filter(
        ([category]) =>
          directive.lines.config.categorical.values[
            directive.closestPointIndex
          ] !== category
      )
      .selectAll<SVGPathElement, LinesGroupSelectionDatum>('path')
      .style('stroke', '#ddd');
  }

  onEnd(directive: LinesHoverMoveDirective<Datum, TLinesComponent>): void {
    directive.lines.lineGroups
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
export class LinesHoverMoveDefaultMarkersStyles<
  Datum,
  TLinesComponent extends LinesComponent<Datum> = LinesComponent<Datum>,
> implements HoverMoveAction<LinesHoverMoveDirective<Datum, TLinesComponent>>
{
  onStart(directive: LinesHoverMoveDirective<Datum, TLinesComponent>): void {
    directive.lines.lineGroups
      .filter(
        ([category]) =>
          directive.lines.config.categorical.values[
            directive.closestPointIndex
          ] === category
      )
      .selectAll<SVGCircleElement, LinesMarkerDatum>('circle')
      .style('fill', null)
      .attr('r', (d) => {
        let r = directive.lines.config.pointMarkers.radius;
        if (directive.closestPointIndex === d.index) {
          r =
            directive.lines.config.pointMarkers.radius +
            directive.lines.config.pointMarkers.growByOnHover;
        }
        return r;
      })
      .raise();

    directive.lines.lineGroups
      .filter(
        ([category]) =>
          directive.lines.config.categorical.values[
            directive.closestPointIndex
          ] !== category
      )
      .selectAll<SVGCircleElement, LinesMarkerDatum>('circle')
      .style('fill', 'transparent');
  }

  onEnd(directive: LinesHoverMoveDirective<Datum, TLinesComponent>): void {
    directive.lines.lineGroups
      .selectAll<SVGCircleElement, LinesMarkerDatum>('circle')
      .style('fill', null)
      .attr('r', () => directive.lines.config.pointMarkers.radius);
  }
}

/**
 * A suggested default action for the hover and move event on lines when
 *  line markers are not used.
 *
 * This action displays a circle marker at the closest datum to the pointer
 *  on the "selected" line.
 */
export class LinesHoverMoveDefaultHoverDotStyles<
  Datum,
  TLinesComponent extends LinesComponent<Datum> = LinesComponent<Datum>,
> implements HoverMoveAction<LinesHoverMoveDirective<Datum, TLinesComponent>>
{
  onStart(directive: LinesHoverMoveDirective<Datum, TLinesComponent>) {
    select(directive.lines.dotRef.nativeElement)
      .selectAll('circle')
      .style('display', null)
      .attr(
        'fill',
        directive.lines.scales.categorical(
          directive.lines.config.categorical.values[directive.closestPointIndex]
        )
      )
      .attr(
        'cx',
        directive.lines.scales.x(
          directive.lines.config.x.values[directive.closestPointIndex]
        )
      )
      .attr(
        'cy',
        directive.lines.scales.y(
          directive.lines.config.y.values[directive.closestPointIndex]
        )
      );
  }

  onEnd(directive: LinesHoverMoveDirective<Datum, TLinesComponent>) {
    select(directive.lines.dotRef.nativeElement)
      .selectAll('circle')
      .style('display', 'none');
  }
}

/**
 * A collection of suggested default actions for the hover and move event
 *  on lines and line markers.
 *
 * Applies either Line Markers action or a Hover Dot action depending on
 *  whether line markers are used.
 */
export class LinesHoverMoveDefaultStyles<
  Datum,
  TLinesComponent extends LinesComponent<Datum> = LinesComponent<Datum>,
> implements HoverMoveAction<LinesHoverMoveDirective<Datum, TLinesComponent>>
{
  linesStyles: HoverMoveAction<LinesHoverMoveDirective<Datum, TLinesComponent>>;
  markersStyles: HoverMoveAction<
    LinesHoverMoveDirective<Datum, TLinesComponent>
  >;
  hoverDotStyles: HoverMoveAction<
    LinesHoverMoveDirective<Datum, TLinesComponent>
  >;

  constructor() {
    this.linesStyles = new LinesHoverMoveDefaultLinesStyles();
    this.markersStyles = new LinesHoverMoveDefaultMarkersStyles();
    this.hoverDotStyles = new LinesHoverMoveDefaultHoverDotStyles();
  }

  onStart(directive: LinesHoverMoveDirective<Datum, TLinesComponent>) {
    this.linesStyles.onStart(directive);

    if (directive.lines.config.hoverDot) {
      this.hoverDotStyles.onStart(directive);
    }
    if (directive.lines.config.pointMarkers) {
      this.markersStyles.onStart(directive);
    }
  }

  onEnd(directive: LinesHoverMoveDirective<Datum, TLinesComponent>) {
    this.linesStyles.onEnd(directive);
    if (directive.lines.config.hoverDot) {
      this.hoverDotStyles.onEnd(directive);
    }
    if (directive.lines.config.pointMarkers) {
      this.markersStyles.onEnd(directive);
    }
  }
}

export class LinesHoverMoveEmitTooltipData<
  Datum,
  TLinesComponent extends LinesComponent<Datum> = LinesComponent<Datum>,
> implements HoverMoveAction<LinesHoverMoveDirective<Datum, TLinesComponent>>
{
  onStart(directive: LinesHoverMoveDirective<Datum, TLinesComponent>): void {
    const tooltipData = directive.getEventOutput();
    directive.eventOutput.emit(tooltipData);
  }

  onEnd(directive: LinesHoverMoveDirective<Datum, TLinesComponent>): void {
    directive.eventOutput.emit(null);
  }
}

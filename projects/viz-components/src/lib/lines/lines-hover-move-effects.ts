import { EventEffect } from '../events/effect';
import { LinesHoverMoveDirective } from './lines-hover-move.directive';

export class LinesHoverMoveDefaultStylesConfig {
  growMarkerDimension: number;

  constructor(init?: Partial<LinesHoverMoveDefaultStylesConfig>) {
    this.growMarkerDimension = 2;
    Object.assign(this, init);
  }
}

/**
 * A suggested default effect for the hover and move event on lines.
 *
 * This effect changes the color of the non-closest-to-pointer lines
 *  to a light gray.
 */
export class LinesHoverMoveDefaultLinesStyles
  implements EventEffect<LinesHoverMoveDirective>
{
  applyEffect(directive: LinesHoverMoveDirective): void {
    directive.lines.lines
      .style('stroke', ([category]): string =>
        directive.lines.values.category[directive.closestPointIndex] ===
        category
          ? null
          : '#ddd'
      )
      .filter(
        ([category]): boolean =>
          directive.lines.values.category[directive.closestPointIndex] ===
          category
      )
      .raise();
  }

  removeEffect(directive: LinesHoverMoveDirective): void {
    directive.lines.lines.style('stroke', null);
  }
}

/**
 * A suggested default effect for the hover and move event on line markers.
 *
 * This effect makes line markers on non-closest-to-pointer lines invisible,
 *  and at the same time enlarges the marker on the "selected" line that is
 *  closest to the pointer by a specified amount.
 */
export class LinesHoverMoveDefaultMarkersStyles
  implements EventEffect<LinesHoverMoveDirective>
{
  constructor(private config?: LinesHoverMoveDefaultStylesConfig) {
    this.config = config ?? new LinesHoverMoveDefaultStylesConfig();
  }

  applyEffect(directive: LinesHoverMoveDirective): void {
    directive.lines.markers
      .style('fill', (d): string =>
        directive.lines.values.category[directive.closestPointIndex] ===
        directive.lines.values.category[d.index]
          ? null
          : 'transparent'
      )
      .attr('r', (d): number => {
        let r = directive.lines.config.pointMarkers.radius;
        if (directive.closestPointIndex === d.index) {
          r =
            directive.lines.config.pointMarkers.radius +
            this.config.growMarkerDimension;
        }
        return r;
      })
      .filter(
        (d): boolean =>
          directive.lines.values.category[directive.closestPointIndex] ===
          directive.lines.values.category[d.index]
      )
      .raise();
  }

  removeEffect(directive: LinesHoverMoveDirective): void {
    directive.lines.markers.style('fill', null);
    directive.lines.markers.attr(
      'r',
      (d) => directive.lines.config.pointMarkers.radius
    );
  }
}

/**
 * A suggested default effect for the hover and move event on lines when
 *  line markers are not used.
 *
 * This effect displays a circle marker at the closest datum to the pointer
 *  on the "selected" line.
 */
export class LinesHoverMoveDefaultHoverDotStyles
  implements EventEffect<LinesHoverMoveDirective>
{
  applyEffect(directive: LinesHoverMoveDirective) {
    directive.lines.hoverDot
      .style('display', null)
      .attr(
        'fill',
        directive.lines.categoryScale(
          directive.lines.values.category[directive.closestPointIndex]
        )
      )
      .attr(
        'cx',
        directive.lines.xScale(
          directive.lines.values.x[directive.closestPointIndex]
        )
      )
      .attr(
        'cy',
        directive.lines.yScale(
          directive.lines.values.y[directive.closestPointIndex]
        )
      );
  }

  removeEffect(directive: LinesHoverMoveDirective) {
    directive.lines.hoverDot.style('display', 'none');
  }
}

/**
 * A collection of suggested default effects for the hover and move event
 *  on lines and line markers.
 *
 * Applies either Line Markers effect or a Hover Dot effect depending on
 *  whether line markers are used.
 */
export class LinesHoverMoveDefaultStyles
  implements EventEffect<LinesHoverMoveDirective>
{
  linesStyles: EventEffect<LinesHoverMoveDirective>;
  markersStyles: EventEffect<LinesHoverMoveDirective>;
  hoverDotStyles: EventEffect<LinesHoverMoveDirective>;

  constructor(config?: LinesHoverMoveDefaultStylesConfig) {
    const markersStylesConfig =
      config ?? new LinesHoverMoveDefaultStylesConfig();
    this.linesStyles = new LinesHoverMoveDefaultLinesStyles();
    this.markersStyles = new LinesHoverMoveDefaultMarkersStyles(
      markersStylesConfig
    );
    this.hoverDotStyles = new LinesHoverMoveDefaultHoverDotStyles();
  }

  applyEffect(directive: LinesHoverMoveDirective) {
    this.linesStyles.applyEffect(directive);
    if (directive.lines.config.pointMarkers.display) {
      this.markersStyles.applyEffect(directive);
    } else {
      this.hoverDotStyles.applyEffect(directive);
    }
  }

  removeEffect(directive: LinesHoverMoveDirective) {
    this.linesStyles.removeEffect(directive);
    if (directive.lines.config.pointMarkers.display) {
      this.markersStyles.removeEffect(directive);
    } else {
      this.hoverDotStyles.removeEffect(directive);
    }
  }
}

export class LinesHoverMoveEmitTooltipData
  implements EventEffect<LinesHoverMoveDirective>
{
  applyEffect(directive: LinesHoverMoveDirective): void {
    const tooltipData = directive.getTooltipData();
    directive.eventOutput.emit(tooltipData);
  }

  removeEffect(directive: LinesHoverMoveDirective): void {
    directive.eventOutput.emit(null);
  }
}

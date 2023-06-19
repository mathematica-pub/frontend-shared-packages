import { EventEffect } from '../events/effect';
import { LinesHoverAndMoveEventDirective } from './lines-hover-move-event.directive';

export class LinesHoverAndMoveEffectDefaultStylesConfig {
  growMarkerDimension: number;

  constructor(init?: Partial<LinesHoverAndMoveEffectDefaultStylesConfig>) {
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
export class LinesHoverAndMoveEffectDefaultLinesStyles
  implements EventEffect<LinesHoverAndMoveEventDirective>
{
  applyEffect(directive: LinesHoverAndMoveEventDirective): void {
    if (!directive.preventEffect) {
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
  }

  removeEffect(directive: LinesHoverAndMoveEventDirective): void {
    if (!directive.preventEffect) {
      directive.lines.lines.style('stroke', null);
    }
  }
}

/**
 * A suggested default effect for the hover and move event on line markers.
 *
 * This effect makes line markers on non-closest-to-pointer lines invisible,
 *  and at the same time enlarges the marker on the "selected" line that is
 *  closest to the pointer by a specified amount.
 */
export class LinesHoverAndMoveEffectDefaultMarkersStyles
  implements EventEffect<LinesHoverAndMoveEventDirective>
{
  constructor(private config?: LinesHoverAndMoveEffectDefaultStylesConfig) {
    this.config = config ?? new LinesHoverAndMoveEffectDefaultStylesConfig();
  }

  applyEffect(directive: LinesHoverAndMoveEventDirective): void {
    if (!directive.preventEffect) {
      directive.lines.markers
        .style('fill', (d): string =>
          directive.lines.values.category[directive.closestPointIndex] ===
          directive.lines.values.category[d.index]
            ? null
            : 'transparent'
        )
        .attr('r', (d): number => {
          let r = directive.lines.config.pointMarker.radius;
          if (directive.closestPointIndex === d.index) {
            r =
              directive.lines.config.pointMarker.radius +
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
  }

  removeEffect(directive: LinesHoverAndMoveEventDirective): void {
    if (!directive.preventEffect) {
      directive.lines.markers.style('fill', null);
      directive.lines.markers.attr(
        'r',
        (d) => directive.lines.config.pointMarker.radius
      );
    }
  }
}

/**
 * A suggested default effect for the hover and move event on lines when
 *  line markers are not used.
 *
 * This effect displays a circle marker at the closest datum to the pointer
 *  on the "selected" line.
 */
export class LinesHoverAndMoveEffectDefaultHoverDotStyles
  implements EventEffect<LinesHoverAndMoveEventDirective>
{
  applyEffect(directive: LinesHoverAndMoveEventDirective) {
    if (!directive.preventEffect) {
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
  }

  removeEffect(directive: LinesHoverAndMoveEventDirective) {
    if (!directive.preventEffect) {
      directive.lines.hoverDot.style('display', 'none');
    }
  }
}

/**
 * A collection of suggested default effects for the hover and move event
 *  on lines and line markers.
 *
 * Applies either Line Markers effect or a Hover Dot effect depending on
 *  whether line markers are used.
 */
export class LinesHoverAndMoveEffectDefaultStyles
  implements EventEffect<LinesHoverAndMoveEventDirective>
{
  linesStyles: EventEffect<LinesHoverAndMoveEventDirective>;
  markersStyles: EventEffect<LinesHoverAndMoveEventDirective>;
  hoverDotStyles: EventEffect<LinesHoverAndMoveEventDirective>;

  constructor(config?: LinesHoverAndMoveEffectDefaultStylesConfig) {
    const markersStylesConfig =
      config ?? new LinesHoverAndMoveEffectDefaultStylesConfig();
    this.linesStyles = new LinesHoverAndMoveEffectDefaultLinesStyles();
    this.markersStyles = new LinesHoverAndMoveEffectDefaultMarkersStyles(
      markersStylesConfig
    );
    this.hoverDotStyles = new LinesHoverAndMoveEffectDefaultHoverDotStyles();
  }

  applyEffect(directive: LinesHoverAndMoveEventDirective) {
    this.linesStyles.applyEffect(directive);
    if (directive.lines.config.pointMarker.display) {
      this.markersStyles.applyEffect(directive);
    } else {
      this.hoverDotStyles.applyEffect(directive);
    }
  }

  removeEffect(directive: LinesHoverAndMoveEventDirective) {
    this.linesStyles.removeEffect(directive);
    if (directive.lines.config.pointMarker.display) {
      this.markersStyles.removeEffect(directive);
    } else {
      this.hoverDotStyles.removeEffect(directive);
    }
  }
}

export class LinesHoverAndMoveEffectEmitTooltipData
  implements EventEffect<LinesHoverAndMoveEventDirective>
{
  applyEffect(directive: LinesHoverAndMoveEventDirective): void {
    if (!directive.preventEffect) {
      const tooltipData = directive.getTooltipData();
      directive.eventOutput.emit(tooltipData);
    }
  }

  removeEffect(directive: LinesHoverAndMoveEventDirective): void {
    if (!directive.preventEffect) {
      directive.eventOutput.emit(null);
    }
  }
}

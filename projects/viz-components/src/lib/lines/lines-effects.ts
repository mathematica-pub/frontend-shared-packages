import { EventEffect } from '../events/effect';
import { formatValue } from '../core/constants/string-formatting.constants';
import { LinesHoverAndMoveEffectDefaultStylesConfig } from './lines-effects-default-styles.config';
import {
  LinesEmittedOutput,
  LinesHoverAndMoveEventDirective,
} from './lines-hover-move-event.directive';

export class LinesHoverAndMoveEffectDefaultLinesStyles
  implements EventEffect<LinesHoverAndMoveEventDirective>
{
  applyEffect(directive: LinesHoverAndMoveEventDirective): void {
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

  removeEffect(directive: LinesHoverAndMoveEventDirective): void {
    directive.lines.lines.style('stroke', null);
  }
}

export class LinesHoverAndMoveEffectDefaultMarkersStyles
  implements EventEffect<LinesHoverAndMoveEventDirective>
{
  constructor(private config?: LinesHoverAndMoveEffectDefaultStylesConfig) {
    this.config = config ?? new LinesHoverAndMoveEffectDefaultStylesConfig();
  }

  applyEffect(directive: LinesHoverAndMoveEventDirective): void {
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

  removeEffect(directive: LinesHoverAndMoveEventDirective): void {
    directive.lines.markers.style('fill', null);
    directive.lines.markers.attr(
      'r',
      (d) => directive.lines.config.pointMarker.radius
    );
  }
}

export class LinesHoverAndMoveEffectDefaultHoverDotStyles
  implements EventEffect<LinesHoverAndMoveEventDirective>
{
  applyEffect(directive: LinesHoverAndMoveEventDirective) {
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

  removeEffect(directive: LinesHoverAndMoveEventDirective) {
    directive.lines.hoverDot.style('display', 'none');
  }
}

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

export class EmitLinesTooltipData
  implements EventEffect<LinesHoverAndMoveEventDirective>
{
  applyEffect(directive: LinesHoverAndMoveEventDirective): void {
    const datum = directive.lines.config.data.find(
      (d) =>
        directive.lines.values.x[directive.closestPointIndex] ===
          directive.lines.config.x.valueAccessor(d) &&
        directive.lines.values.category[directive.closestPointIndex] ===
          directive.lines.config.category.valueAccessor(d)
    );
    const tooltipData: LinesEmittedOutput = {
      datum,
      x: formatValue(
        directive.lines.config.x.valueAccessor(datum),
        directive.lines.config.x.valueFormat
      ),
      y: formatValue(
        directive.lines.config.y.valueAccessor(datum),
        directive.lines.config.y.valueFormat
      ),
      category: directive.lines.config.category.valueAccessor(datum),
      color: directive.lines.categoryScale(
        directive.lines.values.category[directive.closestPointIndex]
      ),
      positionX: directive.lines.xScale(
        directive.lines.values.x[directive.closestPointIndex]
      ),
      positionY: directive.lines.yScale(
        directive.lines.values.y[directive.closestPointIndex]
      ),
    };
    directive.hoverAndMoveEventOutput.emit(tooltipData);
  }

  removeEffect(directive: LinesHoverAndMoveEventDirective): void {
    directive.hoverAndMoveEventOutput.emit(null);
  }
}

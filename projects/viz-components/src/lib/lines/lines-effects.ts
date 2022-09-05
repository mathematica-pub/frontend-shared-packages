import { format, timeFormat } from 'd3';
import { EventEffect } from '../events/effect';
import { LinesHoverAndMoveEffectDefaultStylesConfig } from './lines-effects-default-styles.config';
import {
  LinesEmittedOutput,
  LinesHoverAndMoveEventDirective,
} from './lines-hover-move-event.directive';

export class LinesHoverAndMoveEffectDefaultLinesStyles
  implements EventEffect<LinesHoverAndMoveEventDirective>
{
  applyEffect(event: LinesHoverAndMoveEventDirective): void {
    event.lines.lines
      .style('stroke', ([category]): string =>
        event.lines.values.category[event.closestPointIndex] === category
          ? null
          : '#ddd'
      )
      .filter(
        ([category]): boolean =>
          event.lines.values.category[event.closestPointIndex] === category
      )
      .raise();
  }

  removeEffect(event: LinesHoverAndMoveEventDirective): void {
    event.lines.lines.style('stroke', null);
  }
}

export class LinesHoverAndMoveEffectDefaultMarkersStyles
  implements EventEffect<LinesHoverAndMoveEventDirective>
{
  constructor(private config?: LinesHoverAndMoveEffectDefaultStylesConfig) {
    this.config = config ?? new LinesHoverAndMoveEffectDefaultStylesConfig();
  }

  applyEffect(event: LinesHoverAndMoveEventDirective): void {
    event.lines.markers
      .style('fill', (d): string =>
        event.lines.values.category[event.closestPointIndex] ===
        event.lines.values.category[d.index]
          ? null
          : 'transparent'
      )
      .attr('r', (d): number => {
        let r = event.lines.config.pointMarker.radius;
        if (event.closestPointIndex === d.index) {
          r =
            event.lines.config.pointMarker.radius +
            this.config.growMarkerDimension;
        }
        return r;
      })
      .filter(
        (d): boolean =>
          event.lines.values.category[event.closestPointIndex] ===
          event.lines.values.category[d.index]
      )
      .raise();
  }

  removeEffect(linesEvent: LinesHoverAndMoveEventDirective): void {
    linesEvent.lines.markers.style('fill', null);
  }
}

export class LinesHoverAndMoveEffectDefaultHoverDotStyles
  implements EventEffect<LinesHoverAndMoveEventDirective>
{
  applyEffect(event: LinesHoverAndMoveEventDirective) {
    event.lines.hoverDot
      .style('display', null)
      .attr(
        'fill',
        event.lines.categoryScale(
          event.lines.values.category[event.closestPointIndex]
        )
      )
      .attr(
        'cx',
        event.lines.xScale(event.lines.values.x[event.closestPointIndex])
      )
      .attr(
        'cy',
        event.lines.yScale(event.lines.values.y[event.closestPointIndex])
      );
  }

  removeEffect(event: LinesHoverAndMoveEventDirective) {
    event.lines.hoverDot.style('display', 'none');
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

  applyEffect(event: LinesHoverAndMoveEventDirective) {
    this.linesStyles.applyEffect(event);
    if (event.lines.config.pointMarker.display) {
      this.markersStyles.applyEffect(event);
    } else {
      this.hoverDotStyles.applyEffect(event);
    }
  }

  removeEffect(event: LinesHoverAndMoveEventDirective) {
    this.linesStyles.removeEffect(event);
    if (event.lines.config.pointMarker.display) {
      this.markersStyles.removeEffect(event);
    } else {
      this.hoverDotStyles.removeEffect(event);
    }
  }
}

export class EmitLinesTooltipData
  implements EventEffect<LinesHoverAndMoveEventDirective>
{
  applyEffect(event: LinesHoverAndMoveEventDirective): void {
    const datum = event.lines.config.data.find(
      (d) =>
        event.lines.values.x[event.closestPointIndex] ===
          event.lines.config.x.valueAccessor(d) &&
        event.lines.values.category[event.closestPointIndex] ===
          event.lines.config.category.valueAccessor(d)
    );
    const tooltipData: LinesEmittedOutput = {
      datum,
      x: this.formatValue(
        event.lines.config.x.valueAccessor(datum),
        event.lines.config.x.valueFormat
      ),
      y: this.formatValue(
        event.lines.config.y.valueAccessor(datum),
        event.lines.config.y.valueFormat
      ),
      category: event.lines.config.category.valueAccessor(datum),
      color: event.lines.categoryScale(
        event.lines.values.category[event.closestPointIndex]
      ),
      positionX: event.lines.xScale(
        event.lines.values.x[event.closestPointIndex]
      ),
      positionY: event.lines.yScale(
        event.lines.values.y[event.closestPointIndex]
      ),
    };
    event.hoverAndMoveEventOutput.emit(tooltipData);
  }

  removeEffect(event: LinesHoverAndMoveEventDirective): void {
    event.hoverAndMoveEventOutput.emit(null);
  }

  formatValue(value: any, formatSpecifier: string): string {
    const formatter = value instanceof Date ? timeFormat : format;
    if (formatSpecifier) {
      return formatter(formatSpecifier)(value);
    } else {
      return value.toString();
    }
  }
}

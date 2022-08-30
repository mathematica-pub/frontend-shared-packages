import { format, timeFormat } from 'd3';
import { LinesSvgEventEffect } from './lines-effect';
import { LinesHoverEffectDefaultStylesConfig } from './lines-effects-default-styles.config';
import {
  LinesEmittedOutput,
  LinesHoverAndMoveEventDirective,
} from './lines-hover-move-event.directive';

export class LinesHoverEffectDefaultLinesStyles implements LinesSvgEventEffect {
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

export class LinesHoverEffectDefaultMarkersStyles
  implements LinesSvgEventEffect
{
  constructor(private config: LinesHoverEffectDefaultStylesConfig) {}

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

export class LinesHoverEffectDefaultHoverDotStyles
  implements LinesSvgEventEffect
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

export class LinesHoverEffectDefaultStyles implements LinesSvgEventEffect {
  linesStyles: LinesSvgEventEffect;
  markersStyles: LinesSvgEventEffect;
  hoverDotStyles: LinesSvgEventEffect;

  constructor(config: LinesHoverEffectDefaultStylesConfig) {
    this.linesStyles = new LinesHoverEffectDefaultLinesStyles();
    this.markersStyles = new LinesHoverEffectDefaultMarkersStyles(config);
    this.hoverDotStyles = new LinesHoverEffectDefaultHoverDotStyles();
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

export class EmitLinesTooltipData implements LinesSvgEventEffect {
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

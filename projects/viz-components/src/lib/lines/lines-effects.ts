import { LinesHoverAndMoveEffect } from './lines-effect';
import { LinesHoverEffectDefaultStylesConfig } from './lines-effects-default-styles.config';
import {
  LinesEmittedData,
  LinesHoverAndMoveEvent,
} from './lines-hover-move-event.directive';

export class LinesHoverEffectDefaultLinesStyles
  implements LinesHoverAndMoveEffect
{
  applyEffect(event: LinesHoverAndMoveEvent): void {
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

  removeEffect(event: LinesHoverAndMoveEvent): void {
    event.lines.lines.style('stroke', null);
  }
}

export class LinesHoverEffectDefaultMarkersStyles
  implements LinesHoverAndMoveEffect
{
  constructor(private config: LinesHoverEffectDefaultStylesConfig) {}

  applyEffect(event: LinesHoverAndMoveEvent): void {
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

  removeEffect(linesEvent: LinesHoverAndMoveEvent): void {
    linesEvent.lines.markers.style('fill', null);
  }
}

export class LinesHoverEffectDefaultStyles implements LinesHoverAndMoveEffect {
  linesStyles: LinesHoverAndMoveEffect;
  markersStyles: LinesHoverAndMoveEffect;

  constructor(config: LinesHoverEffectDefaultStylesConfig) {
    this.linesStyles = new LinesHoverEffectDefaultLinesStyles();
    this.markersStyles = new LinesHoverEffectDefaultMarkersStyles(config);
  }

  applyEffect(event: LinesHoverAndMoveEvent) {
    this.linesStyles.applyEffect(event);
    this.markersStyles.applyEffect(event);
  }

  removeEffect(event: LinesHoverAndMoveEvent) {
    this.linesStyles.removeEffect(event);
    this.markersStyles.removeEffect(event);
  }
}

export class EmitLinesTooltipData implements LinesHoverAndMoveEffect {
  applyEffect(event: LinesHoverAndMoveEvent): void {
    const datum = event.lines.config.data.find(
      (d) =>
        event.lines.values.x[event.closestPointIndex] ===
          event.lines.config.x.valueAccessor(d) &&
        event.lines.values.category[event.closestPointIndex] ===
          event.lines.config.category.valueAccessor(d)
    );
    const tooltipData: LinesEmittedData = {
      datum,
      x: event.lines.formatValue(
        event.lines.config.x.valueAccessor(datum),
        event.lines.config.x.valueFormat
      ),
      y: event.lines.formatValue(
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
    event.emittedData.emit(tooltipData);
  }

  removeEffect(event: LinesHoverAndMoveEvent): void {
    event.emittedData.emit(null);
  }
}

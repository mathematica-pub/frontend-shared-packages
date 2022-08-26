import { EventEmitter } from '@angular/core';
import { LinesEffect, LinesHoverAndMoveEffect } from './lines-effect';
import { LinesHoverEffectDefaultStylesConfig } from './lines-effects-default-styles.config';
import { LinesComponent } from './lines.component';
import { LinesEmittedData } from './lines.model';

export class LinesHoverEffectDefaultLinesStyles
  implements LinesHoverAndMoveEffect
{
  applyEffect(lines: LinesComponent, closestPointIndex: number): void {
    lines.lines
      .style('stroke', ([category]): string =>
        lines.values.category[closestPointIndex] === category ? null : '#ddd'
      )
      .filter(
        ([category]): boolean =>
          lines.values.category[closestPointIndex] === category
      )
      .raise();
  }

  removeEffect(lines: LinesComponent): void {
    lines.lines.style('stroke', null);
  }
}

export class LinesHoverEffectDefaultMarkersStyles
  implements LinesHoverAndMoveEffect
{
  constructor(private config: LinesHoverEffectDefaultStylesConfig) {}

  applyEffect(lines: LinesComponent, closestPointIndex: number): void {
    lines.markers
      .style('fill', (d): string =>
        lines.values.category[closestPointIndex] ===
        lines.values.category[d.index]
          ? null
          : 'transparent'
      )
      .attr('r', (d): number => {
        let r = lines.config.pointMarker.radius;
        if (closestPointIndex === d.index) {
          r = lines.config.pointMarker.radius + this.config.growMarkerDimension;
        }
        return r;
      })
      .filter(
        (d): boolean =>
          lines.values.category[closestPointIndex] ===
          lines.values.category[d.index]
      )
      .raise();
  }

  removeEffect(lines: LinesComponent): void {
    lines.markers.style('fill', null);
  }
}

export class LinesHoverEffectDefaultStyles implements LinesHoverAndMoveEffect {
  linesStyles: LinesEffect;
  markersStyles: LinesEffect;

  constructor(config: LinesHoverEffectDefaultStylesConfig) {
    this.linesStyles = new LinesHoverEffectDefaultLinesStyles();
    this.markersStyles = new LinesHoverEffectDefaultMarkersStyles(config);
  }

  applyEffect(lines: LinesComponent, closestPointIndex: number) {
    this.linesStyles.applyEffect(lines, closestPointIndex);
    this.markersStyles.applyEffect(lines, closestPointIndex);
  }

  removeEffect(lines: LinesComponent) {
    this.linesStyles.removeEffect(lines);
    this.markersStyles.removeEffect(lines);
  }
}

export class EmitLinesTooltipData implements LinesHoverAndMoveEffect {
  applyEffect(
    lines: LinesComponent,
    closestPointIndex: number,
    emittedData: EventEmitter<LinesEmittedData>
  ): void {
    const datum = lines.config.data.find(
      (d) =>
        lines.values.x[closestPointIndex] === lines.config.x.valueAccessor(d) &&
        lines.values.category[closestPointIndex] ===
          lines.config.category.valueAccessor(d)
    );
    const tooltipData: LinesEmittedData = {
      datum,
      x: lines.formatValue(
        lines.config.x.valueAccessor(datum),
        lines.config.x.valueFormat
      ),
      y: lines.formatValue(
        lines.config.y.valueAccessor(datum),
        lines.config.y.valueFormat
      ),
      category: lines.config.category.valueAccessor(datum),
      color: lines.categoryScale(lines.values.category[closestPointIndex]),
    };
    emittedData.emit(tooltipData);
  }

  removeEffect(
    lines: LinesComponent,
    emittedData: EventEmitter<LinesEmittedData>
  ): void {
    emittedData.emit(null);
  }
}

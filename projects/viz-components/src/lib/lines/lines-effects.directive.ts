import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { LinesEffect } from './lines-effect';
import { LINES_EFFECT } from './lines-effect.token';
import { LinesComponent } from './lines.component';
import { LinesTooltipData } from './lines.model';

@Directive({
  selector: 'vzc-lines-hover-effect',
  providers: [{ provide: LINES_EFFECT, useExisting: StyleLineForHover }],
})
export class StyleLineForHover implements LinesEffect {
  constructor(private lines: LinesComponent) {}

  applyEffect(closestPointIndex: number): void {
    this.lines.lines
      .style('stroke', ([category]): string =>
        this.lines.values.category[closestPointIndex] === category
          ? null
          : '#ddd'
      )
      .filter(
        ([category]): boolean =>
          this.lines.values.category[closestPointIndex] === category
      )
      .raise();
  }

  removeEffect(): void {
    this.lines.lines.style('stroke', null);
  }
}

@Directive({
  selector: 'vzc-markers-hover-effect',
  providers: [{ provide: LINES_EFFECT, useExisting: StyleMarkersForHover }],
})
export class StyleMarkersForHover implements LinesEffect {
  @Input() growMarkerDimension: number;

  constructor(private lines: LinesComponent) {}

  applyEffect(closestPointIndex: number): void {
    this.lines.markers
      .style('fill', (d): string =>
        this.lines.values.category[closestPointIndex] ===
        this.lines.values.category[d.index]
          ? null
          : '#ddd'
      )
      .attr('r', (d): number => {
        let r = this.lines.config.pointMarker.radius;
        if (closestPointIndex === d.index) {
          r = this.lines.config.pointMarker.radius + this.growMarkerDimension;
        }
        return r;
      })
      .filter(
        (d): boolean =>
          this.lines.values.category[closestPointIndex] ===
          this.lines.values.category[d.index]
      )
      .raise();
  }

  removeEffect(): void {
    this.lines.markers.style('fill', null);
  }
}

@Directive({
  selector: 'vzc-emit-tooltip-data',
  providers: [{ provide: LINES_EFFECT, useExisting: EmitLinesTooltipData }],
})
export class EmitLinesTooltipData implements LinesEffect {
  @Output() tooltip = new EventEmitter<LinesTooltipData>();

  constructor(private lines: LinesComponent) {}

  applyEffect(closestPointIndex: number): void {
    const datum = this.lines.config.data.find(
      (d) =>
        this.lines.values.x[closestPointIndex] ===
          this.lines.config.x.valueAccessor(d) &&
        this.lines.values.category[closestPointIndex] ===
          this.lines.config.category.valueAccessor(d)
    );
    const tooltipData: LinesTooltipData = {
      datum,
      x: this.lines.formatValue(
        this.lines.config.x.valueAccessor(datum),
        this.lines.config.x.valueFormat
      ),
      y: this.lines.formatValue(
        this.lines.config.y.valueAccessor(datum),
        this.lines.config.y.valueFormat
      ),
      category: this.lines.config.category.valueAccessor(datum),
      color: this.lines.categoryScale(
        this.lines.values.category[closestPointIndex]
      ),
    };
    this.emitTooltip(tooltipData);
  }

  removeEffect(): void {
    this.emitTooltip(null);
  }

  emitTooltip(tooltip: LinesTooltipData): void {
    this.tooltip.emit(tooltip);
  }
}

import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { select } from 'd3';
import { EventEffect } from '../events/effect';
import { HoverEventDirective } from '../events/hover-event';
import { GEOGRAPHIES, GeographiesComponent } from './geographies.component';

export class GeographiesHoverEmittedOutput {
  datum?: any;
  color: string;
  geography: string;
  attributeValue: string;
  bounds: [[number, number], [number, number]];
}

@Directive({
  selector: '[vicGeographiesHoverEffects]',
})
export class GeographiesHoverEventDirective extends HoverEventDirective {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('vicGeographiesHoverEffects')
  effects: EventEffect<GeographiesHoverEventDirective>[];
  @Output() hoverEventOutput =
    new EventEmitter<GeographiesHoverEmittedOutput>();
  bounds: [[number, number], [number, number]];
  geographyIndex: number;

  constructor(@Inject(GEOGRAPHIES) public geographies: GeographiesComponent) {
    super();
  }

  setElements(): void {
    this.elements = this.geographies.dataGeographies.nodes();
  }

  elementPointerEnter(event: PointerEvent): void {
    const d = select(event.target as SVGPathElement).datum();
    this.bounds = this.geographies.path.bounds(d);
    this.geographyIndex = this.getGeographyIndex(d);
    this.effects.forEach((effect) => effect.applyEffect(this));
  }

  elementPointerLeave(): void {
    this.effects.forEach((effect) => effect.removeEffect(this));
  }

  // consider making GeographiesEventMixin later to avoid duplicating this method
  // could also be put on data marks component?
  getGeographyIndex(d: any): number {
    let value = this.geographies.config.dataGeographyConfig.valueAccessor(d);
    if (typeof value === 'string') {
      value = value.toLowerCase();
    }
    return this.geographies.values.indexMap.get(value);
  }
}

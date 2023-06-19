/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/no-output-rename */
import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { select } from 'd3';
import { filter, takeUntil } from 'rxjs';
import { EventEffect } from '../events/effect';
import { HoverEventDirective } from '../events/hover-event';
import {
  GeographiesEmittedOutput,
  getGeographiesTooltipData,
} from './geographies-tooltip-data';
import { GEOGRAPHIES, GeographiesComponent } from './geographies.component';

@Directive({
  selector: '[vicGeographiesHoverEffects]',
})
export class GeographiesHoverEventDirective extends HoverEventDirective {
  @Input('vicGeographiesHoverEffects')
  effects: EventEffect<GeographiesHoverEventDirective>[];
  @Output('vicGeographiesHoverOutput') eventOutput =
    new EventEmitter<GeographiesEmittedOutput>();
  bounds: [[number, number], [number, number]];
  geographyIndex: number;

  constructor(@Inject(GEOGRAPHIES) public geographies: GeographiesComponent) {
    super();
  }

  setListenedElements(): void {
    this.geographies.dataGeographies$
      .pipe(
        takeUntil(this.unsubscribe),
        filter((geoSels) => !!geoSels)
      )
      .subscribe((geoSels) => {
        this.elements = geoSels.nodes();
        this.setListeners();
      });
  }

  onElementPointerEnter(event: PointerEvent): void {
    const d = select(event.target as SVGPathElement).datum();
    this.bounds = this.geographies.path.bounds(d);
    this.geographyIndex = this.getGeographyIndex(d);
    this.effects.forEach((effect) => effect.applyEffect(this));
  }

  onElementPointerLeave(): void {
    this.effects.forEach((effect) => effect.removeEffect(this));
  }

  // consider making GeographiesEventMixin later to avoid duplicating this method
  getGeographyIndex(d: any): number {
    let value = this.geographies.config.dataGeographyConfig.valueAccessor(d);
    if (typeof value === 'string') {
      value = value.toLowerCase();
    }
    return this.geographies.values.indexMap.get(value);
  }

  getTooltipData(): GeographiesEmittedOutput {
    const tooltipData = getGeographiesTooltipData(
      this.geographyIndex,
      this.geographies
    );
    tooltipData.bounds = this.bounds;
    return tooltipData;
  }
}

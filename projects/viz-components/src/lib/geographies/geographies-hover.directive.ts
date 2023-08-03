/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/no-output-rename */
import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { select } from 'd3';
import { Feature } from 'geojson';
import { filter, takeUntil } from 'rxjs';
import { EventEffect } from '../events/effect';
import { HoverDirective } from '../events/hover.directive';
import {
  GeographiesEventOutput,
  GeographiesTooltipOutput,
  getGeographiesTooltipData,
} from './geographies-tooltip-data';
import { GEOGRAPHIES, GeographiesComponent } from './geographies.component';

interface GeographiesHoverExtras {
  feature: Feature;
  bounds?: [[number, number], [number, number]];
}

export type GeographiesHoverOutput = GeographiesTooltipOutput &
  GeographiesHoverExtras;

@Directive({
  selector: '[vicGeographiesHoverEffects]',
})
export class GeographiesHoverDirective extends HoverDirective {
  @Input('vicGeographiesHoverEffects')
  effects: EventEffect<GeographiesHoverDirective>[];
  @Output('vicGeographiesHoverOutput') eventOutput =
    new EventEmitter<GeographiesEventOutput>();
  feature: Feature;
  bounds: [[number, number], [number, number]];
  geographyIndex: number;
  positionX: number;
  positionY: number;

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
    const d = select(event.target as SVGPathElement).datum() as Feature;
    this.feature = d;
    this.bounds = this.geographies.path.bounds(d);
    this.geographyIndex = this.getGeographyIndex(d);
    if (this.effects && !this.preventEffect) {
      this.effects.forEach((effect) => effect.applyEffect(this));
    }
  }

  onElementPointerLeave(): void {
    if (this.effects && !this.preventEffect) {
      this.effects.forEach((effect) => effect.removeEffect(this));
    }
  }

  // consider making GeographiesEventMixin later to avoid duplicating this method
  getGeographyIndex(d: any): number {
    let value = this.geographies.config.dataGeographyConfig.valueAccessor(d);
    if (typeof value === 'string') {
      value = value.toLowerCase();
    }
    return this.geographies.values.indexMap.get(value);
  }

  getEventOutput(): GeographiesEventOutput {
    const tooltipData = getGeographiesTooltipData(
      this.geographyIndex,
      this.geographies
    );
    this.positionX = (this.bounds[1][0] + this.bounds[0][0]) / 2;
    this.positionY = (this.bounds[1][1] + this.bounds[0][1] * 2) / 3;
    return {
      ...tooltipData,
      positionX: this.positionX,
      positionY: this.positionY,
    };
  }
}

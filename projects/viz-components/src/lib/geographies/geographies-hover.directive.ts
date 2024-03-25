/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/no-output-rename */
import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { select } from 'd3';
import { Feature, Geometry } from 'geojson';
import { filter, takeUntil } from 'rxjs';
import { EventEffect } from '../events/effect';
import { HoverDirective } from '../events/hover.directive';
import {
  VicGeographiesEventOutput,
  VicGeographiesTooltipOutput,
  getGeographiesTooltipData,
} from './geographies-tooltip-data';
import { GEOGRAPHIES, GeographiesComponent } from './geographies.component';
import { GeographiesFeature } from './geographies.config';

interface GeographiesHoverExtras {
  feature: Feature;
  bounds?: [[number, number], [number, number]];
}

export type GeographiesHoverOutput<Datum> = VicGeographiesTooltipOutput<Datum> &
  GeographiesHoverExtras;

@Directive({
  selector: '[vicGeographiesHoverEffects]',
})
export class GeographiesHoverDirective<
  Datum,
  P,
  G extends Geometry,
  C extends GeographiesComponent<Datum, P, G> = GeographiesComponent<
    Datum,
    P,
    G
  >
> extends HoverDirective {
  @Input('vicGeographiesHoverEffects')
  effects: EventEffect<GeographiesHoverDirective<Datum, P, G, C>>[];
  @Output('vicGeographiesHoverOutput') eventOutput = new EventEmitter<
    VicGeographiesEventOutput<Datum>
  >();
  feature: GeographiesFeature<P, G>;
  bounds: [[number, number], [number, number]];
  positionX: number;
  positionY: number;

  constructor(@Inject(GEOGRAPHIES) public geographies: C) {
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
    const d = select(
      event.target as SVGPathElement
    ).datum() as GeographiesFeature<P, G>;
    this.feature = d;
    this.bounds = this.geographies.path.bounds(d);
    if (this.effects && !this.preventEffect) {
      this.effects.forEach((effect) => effect.applyEffect(this));
    }
  }

  onElementPointerLeave(): void {
    if (this.effects && !this.preventEffect) {
      this.effects.forEach((effect) => effect.removeEffect(this));
    }
  }

  getEventOutput(): VicGeographiesEventOutput<Datum> {
    const tooltipData = getGeographiesTooltipData<Datum, P, G, C>(
      this.feature,
      this.geographies
    );
    this.positionX = (this.bounds[1][0] + this.bounds[0][0]) / 2;
    this.positionY = (this.bounds[1][1] + this.bounds[0][1] * 2) / 3;
    return new VicGeographiesEventOutput({
      ...tooltipData,
      positionX: this.positionX,
      positionY: this.positionY,
    });
  }
}

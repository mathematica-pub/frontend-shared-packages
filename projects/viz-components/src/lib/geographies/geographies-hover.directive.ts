/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/no-output-rename */
import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { select } from 'd3';
import { Feature, Geometry, MultiPolygon, Polygon } from 'geojson';
import { filter, takeUntil } from 'rxjs';
import { EventEffect } from '../events/effect';
import { HoverDirective } from '../events/hover.directive';
import { VicGeographiesFeature } from './geographies-feature';
import {
  VicGeographiesEventOutput,
  VicGeographiesTooltipOutput,
  getGeographiesTooltipData,
} from './geographies-tooltip-data';
import { GEOGRAPHIES, GeographiesComponent } from './geographies.component';

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
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon,
  TComponent extends GeographiesComponent<
    Datum,
    TProperties,
    TGeometry
  > = GeographiesComponent<Datum, TProperties, TGeometry>
> extends HoverDirective {
  @Input('vicGeographiesHoverEffects')
  effects: EventEffect<
    GeographiesHoverDirective<Datum, TProperties, TGeometry, TComponent>
  >[];
  @Output('vicGeographiesHoverOutput') eventOutput = new EventEmitter<
    VicGeographiesEventOutput<Datum>
  >();
  feature: VicGeographiesFeature<TProperties, TGeometry>;
  bounds: [[number, number], [number, number]];
  positionX: number;
  positionY: number;

  constructor(@Inject(GEOGRAPHIES) public geographies: TComponent) {
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
    ).datum() as VicGeographiesFeature<TProperties, TGeometry>;
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
    const tooltipData = getGeographiesTooltipData<
      Datum,
      TProperties,
      TGeometry,
      TComponent
    >(this.feature, this.geographies);
    this.positionX = (this.bounds[1][0] + this.bounds[0][0]) / 2;
    this.positionY = (this.bounds[1][1] + this.bounds[0][1] * 2) / 3;
    return {
      ...tooltipData,
      positionX: this.positionX,
      positionY: this.positionY,
    };
  }
}

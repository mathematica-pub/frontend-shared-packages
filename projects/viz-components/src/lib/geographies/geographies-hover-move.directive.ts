/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/no-output-rename */
import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { select } from 'd3';
import { Geometry } from 'geojson';
import { filter } from 'rxjs';
import { HoverMoveEventEffect } from '../events/effect';
import { HoverMoveDirective } from '../events/hover-move.directive';
import { VicGeographiesFeature } from './geographies';
import {
  VicGeographiesEventOutput,
  getGeographiesTooltipData,
} from './geographies-tooltip-data';
import { GEOGRAPHIES, GeographiesComponent } from './geographies.component';

@Directive({
  selector: '[vicGeographiesHoverMoveEffects]',
})
export class GeographiesHoverMoveDirective<
  Datum,
  TProperties,
  TGeometry extends Geometry,
  TComponent extends GeographiesComponent<
    Datum,
    TProperties,
    TGeometry
  > = GeographiesComponent<Datum, TProperties, TGeometry>
> extends HoverMoveDirective {
  @Input('vicGeographiesHoverMoveEffects')
  effects: HoverMoveEventEffect<
    GeographiesHoverMoveDirective<Datum, TProperties, TGeometry, TComponent>
  >[];
  @Output('vicGeographiesHoverMoveOutput') eventOutput = new EventEmitter<
    VicGeographiesEventOutput<Datum>
  >();
  pointerX: number;
  pointerY: number;
  feature: VicGeographiesFeature<TProperties, TGeometry>;

  constructor(@Inject(GEOGRAPHIES) public geographies: TComponent) {
    super();
  }

  setListenedElements(): void {
    this.geographies.dataGeographies$
      .pipe(
        takeUntilDestroyed(this.geographies.destroyRef),
        filter((geoSels) => !!geoSels)
      )
      .subscribe((geoSels) => {
        this.elements = geoSels.nodes();
        this.setListeners();
      });
  }

  onElementPointerEnter(): void {
    if (this.effects && !this.preventEffect) {
      this.effects.forEach((effect) => {
        if (effect.initializeEffect) {
          effect.initializeEffect(this);
        }
      });
    }
  }

  onElementPointerMove(event: PointerEvent): void {
    [this.pointerX, this.pointerY] = this.getPointerValuesArray(event);
    this.feature = select(
      event.target as Element
    ).datum() as VicGeographiesFeature<TProperties, TGeometry>;
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
    const output = new VicGeographiesEventOutput({
      ...tooltipData,
      positionX: this.pointerX,
      positionY: this.pointerY,
    });
    return output;
  }
}

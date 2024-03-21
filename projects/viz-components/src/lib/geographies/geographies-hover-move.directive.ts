/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/no-output-rename */
import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { select } from 'd3';
import { Feature } from 'geojson';
import { filter } from 'rxjs';
import { HoverMoveEventEffect } from '../events/effect';
import { HoverMoveDirective } from '../events/hover-move.directive';
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
  ExtendedGeographiesComponent extends GeographiesComponent<Datum> = GeographiesComponent<Datum>
> extends HoverMoveDirective {
  @Input('vicGeographiesHoverMoveEffects')
  effects: HoverMoveEventEffect<
    GeographiesHoverMoveDirective<Datum, ExtendedGeographiesComponent>
  >[];
  @Output('vicGeographiesHoverMoveOutput') eventOutput = new EventEmitter<
    VicGeographiesEventOutput<Datum>
  >();
  pointerX: number;
  pointerY: number;
  feature: Feature;

  constructor(
    @Inject(GEOGRAPHIES) public geographies: ExtendedGeographiesComponent
  ) {
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
    this.feature = select(event.target as Element).datum() as Feature;
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
    const tooltipData = getGeographiesTooltipData(
      this.feature,
      this.geographies
    );
    const output: VicGeographiesEventOutput<Datum> = {
      ...tooltipData,
      positionX: this.pointerX,
      positionY: this.pointerY,
    };
    return output;
  }
}

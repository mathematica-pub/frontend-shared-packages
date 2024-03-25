/* eslint-disable @angular-eslint/no-output-rename */
/* eslint-disable @angular-eslint/no-input-rename */
import {
  Directive,
  EventEmitter,
  Inject,
  Input,
  Optional,
  Output,
  Self,
} from '@angular/core';
import { select } from 'd3';
import { Geometry } from 'geojson';
import { Observable, filter, takeUntil } from 'rxjs';
import { ClickDirective } from '../events/click.directive';
import { EventEffect } from '../events/effect';
import { GeographiesEventDirective } from './geographies-event-directive';
import { GeographiesHoverMoveDirective } from './geographies-hover-move.directive';
import { GeographiesHoverDirective } from './geographies-hover.directive';
import { GeographiesInputEventDirective } from './geographies-input-event.directive';
import {
  VicGeographiesEventOutput,
  getGeographiesTooltipData,
} from './geographies-tooltip-data';
import { GEOGRAPHIES, GeographiesComponent } from './geographies.component';
import { GeographiesFeature } from './geographies.config';

@Directive({
  selector: '[vicGeographiesClickEffects]',
})
export class GeographiesClickDirective<
  Datum,
  P,
  G extends Geometry,
  C extends GeographiesComponent<Datum, P, G> = GeographiesComponent<
    Datum,
    P,
    G
  >
> extends ClickDirective {
  @Input('vicGeographiesClickEffects')
  effects: EventEffect<GeographiesClickDirective<Datum, P, G, C>>[];
  @Input('vicGeographiesClickRemoveEvent$')
  override clickRemoveEvent$: Observable<void>;
  @Output('vicGeographiesClickOutput') eventOutput = new EventEmitter<
    VicGeographiesEventOutput<Datum>
  >();
  pointerX: number;
  pointerY: number;
  feature: GeographiesFeature<P, G>;

  constructor(
    @Inject(GEOGRAPHIES) public geographies: C,
    @Self()
    @Optional()
    public hoverDirective?: GeographiesHoverDirective<Datum, P, G, C>,
    @Self()
    @Optional()
    public hoverAndMoveDirective?: GeographiesHoverMoveDirective<
      Datum,
      P,
      G,
      C
    >,
    @Self()
    @Optional()
    public inputEventDirective?: GeographiesInputEventDirective<Datum, P, G, C>
  ) {
    super();
  }

  setListenedElements(): void {
    this.geographies.dataGeographies$
      .pipe(
        takeUntil(this.unsubscribe),
        filter((dataGeographies) => !!dataGeographies)
      )
      .subscribe((dataGeographies) => {
        this.elements = dataGeographies.nodes();
        this.setListeners();
      });
  }

  onElementClick(event: PointerEvent): void {
    [this.pointerX, this.pointerY] = this.getPointerValuesArray(event);
    this.feature = select(
      event.target as Element
    ).datum() as GeographiesFeature<P, G>;
    if (this.hoverDirective) {
      this.pointerX = this.hoverDirective.positionX;
      this.pointerY = this.hoverDirective.positionY;
    }
    this.effects.forEach((effect) => effect.applyEffect(this));
  }

  onClickRemove(): void {
    this.effects.forEach((effect) => effect.removeEffect(this));
    this.pointerX = undefined;
    this.pointerY = undefined;
    this.feature = undefined;
  }

  getOutputData(): VicGeographiesEventOutput<Datum> {
    const tooltipData = getGeographiesTooltipData<Datum, P, G, C>(
      this.feature,
      this.geographies
    );
    return new VicGeographiesEventOutput({
      ...tooltipData,
      positionX: this.pointerX,
      positionY: this.pointerY,
    });
  }

  preventHoverEffects(): void {
    const hoverEventDirectives = [
      this.hoverDirective,
      this.hoverAndMoveDirective,
    ];
    hoverEventDirectives.forEach((directive) => this.disableEffect(directive));
  }

  resumeHoverEffects(removeEffects = true): void {
    const hoverEventDirectives = [
      this.hoverDirective,
      this.hoverAndMoveDirective,
    ];
    hoverEventDirectives.forEach((directive) =>
      this.enableEffect(directive, removeEffects)
    );
  }

  preventInputEventEffects(): void {
    this.disableEffect(this.inputEventDirective);
  }

  resumeInputEventEffects(removeEffects = true): void {
    this.enableEffect(this.inputEventDirective, removeEffects);
  }

  disableEffect(directive: GeographiesEventDirective<Datum, P, G, C>): void {
    if (directive) {
      directive.preventEffect = true;
    }
  }

  enableEffect(
    directive: GeographiesEventDirective<Datum, P, G, C>,
    removeEffects: boolean
  ): void {
    if (directive) {
      directive.preventEffect = false;
      if (removeEffects) {
        directive.effects.forEach((effect) => effect.removeEffect(directive));
      }
    }
  }
}

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
import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { Observable, filter, takeUntil } from 'rxjs';
import { ClickDirective } from '../events/click.directive';
import { EventEffect } from '../events/effect';
import { VicGeographiesFeature } from './geographies';
import { GeographiesEventDirective } from './geographies-event-directive';
import { GeographiesHoverMoveDirective } from './geographies-hover-move.directive';
import { GeographiesHoverDirective } from './geographies-hover.directive';
import { GeographiesInputEventDirective } from './geographies-input-event.directive';
import {
  VicGeographiesEventOutput,
  getGeographiesTooltipData,
} from './geographies-tooltip-data';
import { GEOGRAPHIES, GeographiesComponent } from './geographies.component';

@Directive({
  selector: '[vicGeographiesClickEffects]',
})
export class GeographiesClickDirective<
  Datum,
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon,
  TComponent extends GeographiesComponent<
    Datum,
    TProperties,
    TGeometry
  > = GeographiesComponent<Datum, TProperties, TGeometry>
> extends ClickDirective {
  @Input('vicGeographiesClickEffects')
  effects: EventEffect<
    GeographiesClickDirective<Datum, TProperties, TGeometry, TComponent>
  >[];
  @Input('vicGeographiesClickRemoveEvent$')
  override clickRemoveEvent$: Observable<void>;
  @Output('vicGeographiesClickOutput') eventOutput = new EventEmitter<
    VicGeographiesEventOutput<Datum>
  >();
  pointerX: number;
  pointerY: number;
  feature: VicGeographiesFeature<TProperties, TGeometry>;

  constructor(
    @Inject(GEOGRAPHIES) public geographies: TComponent,
    @Self()
    @Optional()
    public hoverDirective?: GeographiesHoverDirective<
      Datum,
      TProperties,
      TGeometry,
      TComponent
    >,
    @Self()
    @Optional()
    public hoverAndMoveDirective?: GeographiesHoverMoveDirective<
      Datum,
      TProperties,
      TGeometry,
      TComponent
    >,
    @Self()
    @Optional()
    public inputEventDirective?: GeographiesInputEventDirective<
      Datum,
      TProperties,
      TGeometry,
      TComponent
    >
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
    ).datum() as VicGeographiesFeature<TProperties, TGeometry>;
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
    const tooltipData = getGeographiesTooltipData<
      Datum,
      TProperties,
      TGeometry,
      TComponent
    >(this.feature, this.geographies);
    return {
      ...tooltipData,
      positionX: this.pointerX,
      positionY: this.pointerY,
    };
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

  disableEffect(
    directive: GeographiesEventDirective<
      Datum,
      TProperties,
      TGeometry,
      TComponent
    >
  ): void {
    if (directive) {
      directive.preventEffect = true;
    }
  }

  enableEffect(
    directive: GeographiesEventDirective<
      Datum,
      TProperties,
      TGeometry,
      TComponent
    >,
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

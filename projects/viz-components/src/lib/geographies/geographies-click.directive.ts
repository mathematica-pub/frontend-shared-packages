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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { select } from 'd3';
import { Feature } from 'geojson';
import { Observable, filter } from 'rxjs';
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

@Directive({
  selector: '[vicGeographiesClickEffects]',
})
export class GeographiesClickDirective<
  Datum,
  ExtendedGeographiesComponent extends GeographiesComponent<Datum> = GeographiesComponent<Datum>
> extends ClickDirective {
  @Input('vicGeographiesClickEffects')
  effects: EventEffect<
    GeographiesClickDirective<Datum, ExtendedGeographiesComponent>
  >[];
  @Input('vicGeographiesClickRemoveEvent$')
  override clickRemoveEvent$: Observable<void>;
  @Output('vicGeographiesClickOutput') eventOutput = new EventEmitter<
    VicGeographiesEventOutput<Datum>
  >();
  pointerX: number;
  pointerY: number;
  geographyIndex: number;

  constructor(
    @Inject(GEOGRAPHIES) public geographies: ExtendedGeographiesComponent,
    @Self()
    @Optional()
    public hoverDirective?: GeographiesHoverDirective<
      Datum,
      ExtendedGeographiesComponent
    >,
    @Self()
    @Optional()
    public hoverAndMoveDirective?: GeographiesHoverMoveDirective<
      Datum,
      ExtendedGeographiesComponent
    >,
    @Self()
    @Optional()
    public inputEventDirective?: GeographiesInputEventDirective<
      Datum,
      ExtendedGeographiesComponent
    >
  ) {
    super();
  }

  setListenedElements(): void {
    this.geographies.dataGeographies$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((dataGeographies) => !!dataGeographies)
      )
      .subscribe((dataGeographies) => {
        this.elements = dataGeographies.nodes();
        this.setListeners();
      });
  }

  onElementClick(event: PointerEvent): void {
    [this.pointerX, this.pointerY] = this.getPointerValuesArray(event);
    const d = select(event.target as Element).datum() as Feature;
    this.geographyIndex = this.getGeographyIndex(d);
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
    this.geographyIndex = undefined;
  }

  getGeographyIndex(d: Feature): number {
    let value =
      this.geographies.config.dataGeographyConfig.featureIndexAccessor(
        d.properties
      );
    if (typeof value === 'string') {
      value = value.toLowerCase();
    }
    return this.geographies.values.indexMap.get(value);
  }

  getOutputData(): VicGeographiesEventOutput<Datum> {
    const tooltipData = getGeographiesTooltipData(
      this.geographyIndex,
      this.geographies
    );
    const output: VicGeographiesEventOutput<Datum> = {
      ...tooltipData,
      positionX: this.pointerX,
      positionY: this.pointerY,
    };
    return output;
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
    directive: GeographiesEventDirective<Datum, ExtendedGeographiesComponent>
  ): void {
    if (directive) {
      directive.preventEffect = true;
    }
  }

  enableEffect(
    directive: GeographiesEventDirective<Datum, ExtendedGeographiesComponent>,
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

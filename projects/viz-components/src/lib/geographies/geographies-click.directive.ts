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

@Directive({
  selector: '[vicGeographiesClickEffects]',
})
export class GeographiesClickDirective<
  T,
  U extends GeographiesComponent<T> = GeographiesComponent<T>
> extends ClickDirective {
  @Input('vicGeographiesClickEffects')
  effects: EventEffect<GeographiesClickDirective<T, U>>[];
  @Input('vicGeographiesClickRemoveEvent$')
  override clickRemoveEvent$: Observable<void>;
  @Output('vicGeographiesClickOutput') eventOutput = new EventEmitter<
    VicGeographiesEventOutput<T>
  >();
  pointerX: number;
  pointerY: number;
  geographyIndex: number;

  constructor(
    @Inject(GEOGRAPHIES) public geographies: U,
    @Self()
    @Optional()
    public hoverDirective?: GeographiesHoverDirective<T, U>,
    @Self()
    @Optional()
    public hoverAndMoveDirective?: GeographiesHoverMoveDirective<T, U>,
    @Self()
    @Optional()
    public inputEventDirective?: GeographiesInputEventDirective<T, U>
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
    const d = select(event.target as Element).datum();
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

  getGeographyIndex(d: any): number {
    let value =
      this.geographies.config.dataGeographyConfig.featureIdAccessor(d);
    if (typeof value === 'string') {
      value = value.toLowerCase();
    }
    return this.geographies.values.indexMap.get(value);
  }

  getOutputData(): VicGeographiesEventOutput<T> {
    const tooltipData = getGeographiesTooltipData(
      this.geographyIndex,
      this.geographies
    );
    const output: VicGeographiesEventOutput<T> = {
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

  disableEffect(directive: GeographiesEventDirective<T, U>): void {
    if (directive) {
      directive.preventEffect = true;
    }
  }

  enableEffect(
    directive: GeographiesEventDirective<T, U>,
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

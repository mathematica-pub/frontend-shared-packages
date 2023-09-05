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
import { filter, Observable, takeUntil } from 'rxjs';
import { ClickDirective } from '../events/click.directive';
import { EventEffect } from '../events/effect';
import { GeographiesHoverMoveDirective } from './geographies-hover-move.directive';
import { GeographiesHoverDirective } from './geographies-hover.directive';
import { GeographiesInputEventDirective } from './geographies-input-event.directive';
import {
  GeographiesEventOutput,
  getGeographiesTooltipData,
} from './geographies-tooltip-data';
import { GEOGRAPHIES, GeographiesComponent } from './geographies.component';

export type GeographiesEventDirective =
  | GeographiesHoverDirective
  | GeographiesHoverMoveDirective
  | GeographiesInputEventDirective;

@Directive({
  selector: '[vicGeographiesClickEffects]',
})
export class GeographiesClickDirective<
  T extends GeographiesComponent = GeographiesComponent
> extends ClickDirective {
  @Input('vicGeographiesClickEffects')
  effects: EventEffect<GeographiesClickDirective<T>>[];
  @Input('vicGeographiesClickRemoveEvent$')
  override clickRemoveEvent$: Observable<void>;
  @Output('vicGeographiesClickOutput') eventOutput =
    new EventEmitter<GeographiesEventOutput>();
  pointerX: number;
  pointerY: number;
  geographyIndex: number;

  constructor(
    @Inject(GEOGRAPHIES) public geographies: GeographiesComponent,
    @Self()
    @Optional()
    public hoverDirective?: GeographiesHoverDirective,
    @Self()
    @Optional()
    public hoverAndMoveDirective?: GeographiesHoverMoveDirective,
    @Self()
    @Optional()
    public inputEventDirective?: GeographiesInputEventDirective
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
    let value = this.geographies.config.dataGeographyConfig.valueAccessor(d);
    if (typeof value === 'string') {
      value = value.toLowerCase();
    }
    return this.geographies.values.indexMap.get(value);
  }

  getOutputData(): GeographiesEventOutput {
    const tooltipData = getGeographiesTooltipData(
      this.geographyIndex,
      this.geographies
    );
    const output: GeographiesEventOutput = {
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

  disableEffect(directive: GeographiesEventDirective): void {
    if (directive) {
      directive.preventEffect = true;
    }
  }

  enableEffect(
    directive: GeographiesEventDirective,
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

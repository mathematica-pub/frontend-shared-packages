/* eslint-disable @angular-eslint/no-output-rename */
/* eslint-disable @angular-eslint/no-input-rename */

import {
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  Optional,
  Output,
  Self,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { select } from 'd3';
import { Observable, filter } from 'rxjs';
import { DataValue } from '../../core/types/values';
import { ClickDirective } from '../../events/click.directive';
import { EventEffect } from '../../events/effect';
import { BARS, BarDatum, BarsComponent } from '../bars.component';
import { BarsEventDirective } from './bars-event-directive';
import { BarsEventOutput } from './bars-event-output';
import { BarsHoverMoveDirective } from './bars-hover-move.directive';
import { BarsHoverDirective } from './bars-hover.directive';
import { BarsInputEventDirective } from './bars-input-event.directive';
import { barsTooltipMixin } from './bars-tooltip';

@Directive({
  selector: '[vicBarsClickEffects]',
})
export class BarsClickDirective<
  Datum,
  TOrdinalValue extends DataValue,
  TBarsComponent extends BarsComponent<Datum, TOrdinalValue> = BarsComponent<
    Datum,
    TOrdinalValue
  >
> extends barsTooltipMixin(ClickDirective) {
  @Input('vicBarsClickEffects')
  effects: EventEffect<
    BarsClickDirective<Datum, TOrdinalValue, TBarsComponent>
  >[];
  @Input('vicBarsClickRemoveEvent$')
  override clickRemoveEvent$: Observable<void>;
  @Output('vicBarsClickOutput') eventOutput = new EventEmitter<
    BarsEventOutput<Datum, TOrdinalValue>
  >();
  barDatum: BarDatum<TOrdinalValue>;
  elRef: ElementRef;
  pointerX: number;
  pointerY: number;

  constructor(
    @Inject(BARS) public bars: TBarsComponent,
    @Self()
    @Optional()
    public hoverDirective?: BarsHoverDirective<
      Datum,
      TOrdinalValue,
      TBarsComponent
    >,
    @Self()
    @Optional()
    public hoverAndMoveDirective?: BarsHoverMoveDirective<
      Datum,
      TOrdinalValue,
      TBarsComponent
    >,
    @Self()
    @Optional()
    public inputEventDirective?: BarsInputEventDirective<
      Datum,
      TOrdinalValue,
      TBarsComponent
    >
  ) {
    super();
  }

  setListenedElements(): void {
    this.bars.bars$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((barSels) => !!barSels)
      )
      .subscribe((barSels) => {
        this.elements = barSels.nodes();
        this.setListeners();
      });
  }

  onElementClick(event: PointerEvent): void {
    this.barDatum = select(
      event.target as SVGRectElement
    ).datum() as BarDatum<TOrdinalValue>;
    this.elRef = new ElementRef(event.target);
    [this.pointerX, this.pointerY] = this.getPointerValuesArray(event);
    if (this.hoverDirective) {
      this.pointerX = this.hoverDirective.positionX;
      this.pointerY = this.hoverDirective.positionY;
    }
    this.effects.forEach((effect) => effect.applyEffect(this));
  }

  onClickRemove(): void {
    this.effects.forEach((effect) => effect.removeEffect(this));
    this.barDatum = undefined;
    this.elRef = undefined;
    this.pointerX = undefined;
    this.pointerY = undefined;
  }

  getEventOutput(): BarsEventOutput<Datum, TOrdinalValue> {
    const data = this.getBarsTooltipData(this.barDatum, this.elRef, this.bars);
    const extras = {
      positionX: this.pointerX,
      positionY: this.pointerY,
    };
    return { ...data, ...extras };
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
    directive: BarsEventDirective<Datum, TOrdinalValue, TBarsComponent>
  ): void {
    if (directive) {
      directive.preventEffect = true;
    }
  }

  enableEffect(
    directive: BarsEventDirective<Datum, TOrdinalValue, TBarsComponent>,
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

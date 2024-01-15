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
import { select } from 'd3';
import { Observable, filter, takeUntil } from 'rxjs';
import { ClickDirective } from '../events/click.directive';
import { EventEffect } from '../events/effect';
import { BarsEventDirective } from './bars-event-directive';
import { BarsHoverMoveDirective } from './bars-hover-move.directive';
import { BarsHoverDirective } from './bars-hover.directive';
import { BarsInputEventDirective } from './bars-input-event.directive';
import { VicBarsEventOutput, getBarsTooltipData } from './bars-tooltip-data';
import { BARS, BarsComponent } from './bars.component';

@Directive({
  selector: '[vicBarsClickEffects]',
})
export class BarsClickDirective<
  T,
  U extends BarsComponent<T> = BarsComponent<T>
> extends ClickDirective {
  @Input('vicBarsClickEffects')
  effects: EventEffect<BarsClickDirective<T, U>>[];
  @Input('vicBarsClickRemoveEvent$')
  override clickRemoveEvent$: Observable<void>;
  @Output('vicBarsClickOutput') eventOutput = new EventEmitter<
    VicBarsEventOutput<T>
  >();
  barIndex: number;
  elRef: ElementRef;
  pointerX: number;
  pointerY: number;

  constructor(
    @Inject(BARS) public bars: U,
    @Self()
    @Optional()
    public hoverDirective?: BarsHoverDirective<T, U>,
    @Self()
    @Optional()
    public hoverAndMoveDirective?: BarsHoverMoveDirective<T, U>,
    @Self()
    @Optional()
    public inputEventDirective?: BarsInputEventDirective<T, U>
  ) {
    super();
  }

  setListenedElements(): void {
    this.bars.bars$
      .pipe(
        takeUntil(this.unsubscribe),
        filter((barSels) => !!barSels)
      )
      .subscribe((barSels) => {
        this.elements = barSels.nodes();
        this.setListeners();
      });
  }

  onElementClick(event: PointerEvent): void {
    this.barIndex = select(event.target as SVGRectElement).datum() as number;
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
    this.barIndex = undefined;
    this.elRef = undefined;
    this.pointerX = undefined;
    this.pointerY = undefined;
  }

  getEventOutput(): VicBarsEventOutput<T> {
    const data = getBarsTooltipData(this.barIndex, this.elRef, this.bars);
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

  disableEffect(directive: BarsEventDirective<T, U>): void {
    if (directive) {
      directive.preventEffect = true;
    }
  }

  enableEffect(
    directive: BarsEventDirective<T, U>,
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

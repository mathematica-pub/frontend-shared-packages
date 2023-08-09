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
import { Observable, filter, takeUntil } from 'rxjs';
import { ClickDirective } from '../events/click.directive';
import { EventEffect } from '../events/effect';
import { ListenElement } from '../events/event.directive';
import { BarsHoverMoveDirective } from './bars-hover-move.directive';
import { BarsHoverDirective } from './bars-hover.directive';
import { BarsInputEventDirective } from './bars-input-event.directive';
import { getBarsTooltipData, BarsEventOutput } from './bars-tooltip-data';
import { BARS, BarsComponent } from './bars.component';

type BarsEventDirective =
  | BarsHoverDirective
  | BarsHoverMoveDirective
  | BarsInputEventDirective;

@Directive({
  selector: '[vicBarsClickEffects]',
})
export class BarsClickDirective extends ClickDirective {
  @Input('vicBarsClickEffects')
  effects: EventEffect<BarsClickDirective>[];
  @Input('vicBarsClickRemoveEvent$')
  override clickRemoveEvent$: Observable<void>;
  @Output('vicBarsClickOutput') eventOutput =
    new EventEmitter<BarsEventOutput>();

  constructor(
    @Inject(BARS) public bars: BarsComponent,
    @Self()
    @Optional()
    public hoverDirective?: BarsHoverDirective,
    @Self()
    @Optional()
    public hoverAndMoveDirective?: BarsHoverMoveDirective,
    @Self()
    @Optional()
    public inputEventDirective?: BarsInputEventDirective
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

  onElementClick(event: PointerEvent, el: ListenElement): void {
    this.effects.forEach((effect) => effect.applyEffect(this));
  }

  onClickRemove(): void {
    this.effects.forEach((effect) => effect.removeEffect(this));
  }

  getTooltipData(): BarsEventOutput {
    if (!this.hoverAndMoveDirective) {
      console.warn(
        'Tooltip data can only be retrieved when a BarsHoverMoveDirective is implemented.'
      );
    }
    if (this.hoverAndMoveDirective) {
      const data = getBarsTooltipData(
        this.hoverAndMoveDirective.barIndex,
        this.hoverAndMoveDirective.elRef,
        this.hoverAndMoveDirective.bars
      );

      const output: BarsEventOutput = {
        ...data,
        positionX: this.hoverAndMoveDirective.pointerX,
        positionY: this.hoverAndMoveDirective.pointerY,
      };
      return output;
    } else {
      return null;
    }
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

  disableEffect(directive: BarsEventDirective): void {
    if (directive) {
      directive.preventEffect = true;
    }
  }

  enableEffect(directive: BarsEventDirective, removeEffects: boolean): void {
    if (directive) {
      directive.preventEffect = false;
      if (removeEffects) {
        directive.effects.forEach((effect) => effect.removeEffect(directive));
      }
    }
  }
}

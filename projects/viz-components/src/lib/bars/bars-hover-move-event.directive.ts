import {
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  Output,
} from '@angular/core';
import { select } from 'd3';
import { filter, takeUntil } from 'rxjs';
import { EventEffect } from '../events/effect';
import { HoverAndMoveEventDirective } from '../events/hover-move-event';
import { BARS, BarsComponent } from './bars.component';

export class BarsHoverAndMoveEmittedOutput {
  datum: any;
  color: string;
  ordinal: string;
  quantitative: string;
  category: string;
  elRef: ElementRef;
  positionX?: number;
  positionY?: number;
}

@Directive({
  selector: '[vicBarsHoverAndMoveEffects]',
})
export class BarsHoverAndMoveEventDirective extends HoverAndMoveEventDirective {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('vicBarsHoverAndMoveEffects')
  effects: EventEffect<BarsHoverAndMoveEventDirective>[];
  @Output() hoverAndMoveEventOutput =
    new EventEmitter<BarsHoverAndMoveEmittedOutput>();
  barIndex: number;
  elRef: ElementRef;
  pointerX: number;
  pointerY: number;

  constructor(@Inject(BARS) public bars: BarsComponent) {
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

  elementPointerEnter(event: PointerEvent): void {
    this.barIndex = this.getBarIndex(event);
    this.elRef = new ElementRef(event.target);
  }

  getBarIndex(event: PointerEvent): number {
    return select(event.target as SVGRectElement).datum() as number;
  }

  elementPointerMove(event: PointerEvent) {
    [this.pointerX, this.pointerY] = this.getPointerValuesArray(event);
    if (this.effects) {
      this.effects.forEach((effect) => effect.applyEffect(this));
    }
  }

  elementPointerLeave() {
    if (this.effects) {
      this.effects.forEach((effect) => effect.removeEffect(this));
    }
    this.barIndex = undefined;
    this.elRef = undefined;
  }
}

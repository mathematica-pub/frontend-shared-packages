import {
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  Output,
} from '@angular/core';
import { select } from 'd3';
import { filter } from 'rxjs';
import { EventEffect } from '../events/effect';
import { HoverEventDirective } from '../events/hover-event';
import { BARS, BarsComponent } from './bars.component';

export class BarsHoverEmittedOutput {
  datum: any;
  color: string;
  ordinal: string;
  quantitative: string;
  category: string;
  barBounds: [[number, number], [number, number]];
}

@Directive({
  selector: '[vicBarsHoverEffects]',
})
export class BarsHoverEventDirective extends HoverEventDirective {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('vicBarsHoverEffects') effects: EventEffect<BarsHoverEventDirective>[];
  @Output() hoverEventOutput = new EventEmitter<BarsHoverEmittedOutput>();
  barIndex: number;
  elRef: ElementRef;

  constructor(@Inject(BARS) public bars: BarsComponent) {
    super();
  }

  setListenedElements(): void {
    this.bars.bars$
      .pipe(filter((barSels) => !!barSels))
      .subscribe((barSels) => {
        this.elements = barSels.nodes();
        this.setListeners();
      });
  }

  elementPointerEnter(event: PointerEvent): void {
    this.barIndex = select(event.target as SVGRectElement).datum() as number;
    this.elRef = new ElementRef(event.target);
    if (this.effects) {
      this.effects.forEach((effect) => effect.applyEffect(this));
    }
  }

  elementPointerLeave(): void {
    if (this.effects) {
      this.effects.forEach((effect) => effect.removeEffect(this));
    }
  }
}

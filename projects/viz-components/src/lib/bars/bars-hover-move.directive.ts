/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/no-output-rename */
import {
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { select } from 'd3';
import { Observable } from 'rxjs';
import { EventEffect } from '../events/effect';
import { HoverMoveDirective } from '../events/hover-move.directive';
import { BarsEventOutput, getBarsTooltipData } from './bars-tooltip-data';
import { BARS, BarsComponent } from './bars.component';
import { setListenedElementsClassSelectorMixinFunction } from '../events/listen-elements-class-selector.mixin';

const ListenElementsHoverMoveDirective =
  setListenedElementsClassSelectorMixinFunction(HoverMoveDirective);

@Directive({
  selector: '[vicBarsHoverMoveEffects]',
})
export class BarsHoverMoveDirective
  extends ListenElementsHoverMoveDirective
  implements OnChanges
{
  @Input('vicBarsHoverMoveEffects')
  effects: EventEffect<BarsHoverMoveDirective>[];
  @Input('vicBarsHoverMoveListenElementsClassSelector')
  listenElementsClassSelector: string;
  @Output('vicBarsHoverMoveOutput') eventOutput =
    new EventEmitter<BarsEventOutput>();
  barIndex: number;
  elRef: ElementRef;
  pointerX: number;
  pointerY: number;
  selectionObservable: Observable<any>;

  constructor(@Inject(BARS) public bars: BarsComponent) {
    super();
    this.selectionObservable = bars.bars$;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['vicBarsHoverMoveListenElementsClassSelector']) {
      console.log(changes['vicBarsHoverMoveListenElementsClassSelector']);
    }
  }

  onElementPointerEnter(event: PointerEvent): void {
    if (!this.preventEffect) {
      this.barIndex = this.getBarIndex(event);
      this.elRef = new ElementRef(event.target);
    }
  }

  getBarIndex(event: PointerEvent): number {
    return select(event.target as SVGRectElement).datum() as number;
  }

  onElementPointerMove(event: PointerEvent) {
    [this.pointerX, this.pointerY] = this.getPointerValuesArray(event);
    if (this.effects && !this.preventEffect) {
      this.effects.forEach((effect) => effect.applyEffect(this));
    }
  }

  onElementPointerLeave() {
    if (this.effects && !this.preventEffect) {
      this.effects.forEach((effect) => effect.removeEffect(this));
    }
    this.barIndex = undefined;
    this.elRef = undefined;
  }

  getEventOutput(): BarsEventOutput {
    const tooltipData = getBarsTooltipData(
      this.barIndex,
      this.elRef,
      this.bars
    );
    const extras = {
      positionX: this.pointerX,
      positionY: this.pointerY,
    };
    return { ...tooltipData, ...extras };
  }
}

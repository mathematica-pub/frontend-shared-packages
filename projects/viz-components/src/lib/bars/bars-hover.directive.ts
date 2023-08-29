/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/no-output-rename */
import {
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  Output,
} from '@angular/core';
import { select } from 'd3';
import { Observable } from 'rxjs';
import { EventEffect } from '../events/effect';
import { HoverDirective } from '../events/hover.directive';
import { BarsEventOutput, getBarsTooltipData } from './bars-tooltip-data';
import { BARS, BarsComponent } from './bars.component';
import { setListenedElementsClassSelectorMixinFunction } from '../events/listen-elements-class-selector.mixin';

const ListenElementsHoverDirective =
  setListenedElementsClassSelectorMixinFunction(HoverDirective);

@Directive({
  selector: '[vicBarsHoverEffects]',
})
export class BarsHoverDirective extends ListenElementsHoverDirective {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('vicBarsHoverEffects') effects: EventEffect<BarsHoverDirective>[];
  @Input('vicBarsHoverListenElementsClassSelector')
  listenElementsClassSelector: string;
  @Output('vicBarsHoverOutput') eventOutput =
    new EventEmitter<BarsEventOutput>();
  barIndex: number;
  elRef: ElementRef;
  positionX: number;
  positionY: number;
  selectionObservable: Observable<any>;

  constructor(@Inject(BARS) public bars: BarsComponent) {
    super();
    this.selectionObservable = bars.bars$;
  }

  onElementPointerEnter(event: PointerEvent): void {
    this.barIndex = select(event.target as SVGRectElement).datum() as number;
    this.elRef = new ElementRef(event.target);
    const barRect = this.elRef.nativeElement.getBoundingClientRect();
    this.positionX = barRect.x + barRect.width / 2;
    this.positionY = barRect.y;
    if (this.effects) {
      this.effects.forEach((effect) => effect.applyEffect(this));
    }
  }

  onElementPointerLeave(): void {
    if (this.effects) {
      this.effects.forEach((effect) => effect.removeEffect(this));
    }
  }

  getEventOutput(): BarsEventOutput {
    const tooltipData = getBarsTooltipData(
      this.barIndex,
      this.elRef,
      this.bars
    );

    return {
      ...tooltipData,
      positionX: this.positionX,
      positionY: this.positionY,
    };
  }
}

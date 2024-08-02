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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { select } from 'd3';
import { filter } from 'rxjs';
import { EventEffect } from '../events/effect';
import { HoverDirective } from '../events/hover.directive';
import { VicBarsEventOutput, getBarsTooltipData } from './bars-tooltip-data';
import { BARS, BarsComponent } from './bars.component';

@Directive({
  selector: '[vicBarsHoverEffects]',
})
export class BarsHoverDirective<
  Datum,
  ExtendedBarsComponent extends BarsComponent<Datum> = BarsComponent<Datum>
> extends HoverDirective {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('vicBarsHoverEffects') effects: EventEffect<
    BarsHoverDirective<Datum, ExtendedBarsComponent>
  >[];
  @Output('vicBarsHoverOutput') eventOutput = new EventEmitter<
    VicBarsEventOutput<Datum>
  >();
  barIndex: number;
  elRef: ElementRef;
  positionX: number;
  positionY: number;

  constructor(@Inject(BARS) public bars: ExtendedBarsComponent) {
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

  getEventOutput(): VicBarsEventOutput<Datum> {
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

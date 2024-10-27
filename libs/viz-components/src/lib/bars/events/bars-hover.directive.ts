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
import { DataValue } from '../../core/types/values';
import { EventAction } from '../../events/action';
import { HoverDirective } from '../../events/hover.directive';
import { BarDatum, BARS, BarsComponent } from '../bars.component';
import { BarsEventOutput } from './bars-event-output';

@Directive({
  selector: '[vicBarsHoverActions]',
})
export class BarsHoverDirective<
  Datum,
  TOrdinalValue extends DataValue,
  TBarsComponent extends BarsComponent<Datum, TOrdinalValue> = BarsComponent<
    Datum,
    TOrdinalValue
  >,
> extends HoverDirective {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('vicBarsHoverActions') actions: EventAction<
    BarsHoverDirective<Datum, TOrdinalValue, TBarsComponent>
  >[];
  @Output('vicBarsHoverOutput') eventOutput = new EventEmitter<
    BarsEventOutput<Datum, TOrdinalValue>
  >();
  barDatum: BarDatum<TOrdinalValue>;
  elRef: ElementRef;
  positionX: number;
  positionY: number;

  constructor(@Inject(BARS) public bars: TBarsComponent) {
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
    this.barDatum = select(
      event.target as SVGRectElement
    ).datum() as BarDatum<TOrdinalValue>;
    this.elRef = new ElementRef(event.target);
    const barRect = this.elRef.nativeElement.getBoundingClientRect();
    this.positionX = barRect.x + barRect.width / 2;
    this.positionY = barRect.y;
    if (this.actions) {
      this.actions.forEach((action) => action.onStart(this));
    }
  }

  onElementPointerLeave(): void {
    if (this.actions) {
      this.actions.forEach((action) => action.onEnd(this));
    }
  }

  getEventOutput(): BarsEventOutput<Datum, TOrdinalValue> {
    const tooltipData = this.bars.getTooltipData(this.barDatum, this.elRef);

    return {
      ...tooltipData,
      positionX: this.positionX,
      positionY: this.positionY,
    };
  }
}

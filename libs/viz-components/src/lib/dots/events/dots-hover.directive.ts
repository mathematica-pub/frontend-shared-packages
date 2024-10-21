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
import { EventAction } from '../../events/action';
import { HoverDirective } from '../../events/hover.directive';
import { DotDatum, DotsComponent } from '../dots.component';
import { DotsEventOutput } from './dots-event-output';
import { dotsTooltipMixin } from './dots-tooltip';

@Directive({
  selector: '[vicDotsHoverActions]',
})
export class DotsHoverDirective<
  Datum,
  Color extends string | number,
  Radius extends string | number,
  TDotsComponent extends DotsComponent<Datum> = DotsComponent<Datum>,
> extends dotsTooltipMixin(HoverDirective) {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('vicDotsHoverActions') actions: EventAction<
    DotsHoverDirective<Datum, Color, Radius, TDotsComponent>
  >[];
  @Output('vicDotsHoverOutput') eventOutput = new EventEmitter<
    DotsEventOutput<Datum, Color, Radius>
  >();
  dotDatum: DotDatum<Color, Radius>;
  elRef: ElementRef;
  positionX: number;
  positionY: number;

  constructor(@Inject(DOTS) public dots: TDotsComponent) {
    super();
  }

  setListenedElements(): void {
    this.dots.dots$
      .pipe(
        takeUntilDestroyed(this.dots.destroyRef),
        filter((dotSels) => !!dotSels)
      )
      .subscribe((dotSels) => {
        this.elements = dotSels.nodes();
        this.setListeners();
      });
  }

  onElementPointerEnter(event: PointerEvent): void {
    this.dotDatum = select(event.target as SVGRectElement).datum() as DotDatum<
      Color,
      Radius
    >;
    this.elRef = new ElementRef(event.target);
    const dotRect = this.elRef.nativeElement.getBoundingClientRect();
    this.positionX = dotRect.x + dotRect.width / 2;
    this.positionY = dotRect.y;
    if (this.actions) {
      this.actions.forEach((action) => action.onStart(this));
    }
  }

  onElementPointerLeave(): void {
    if (this.actions) {
      this.actions.forEach((action) => action.onEnd(this));
    }
  }

  getEventOutput(): DotsEventOutput<Datum, Color, Radius> {
    const tooltipData = this.getDotsTooltipData(
      this.dotDatum,
      this.elRef,
      this.dots
    );

    return {
      ...tooltipData,
      positionX: this.positionX,
      positionY: this.positionY,
    };
  }
}

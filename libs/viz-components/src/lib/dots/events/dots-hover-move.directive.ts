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
import { HoverMoveAction } from '../../events/action';
import { HoverMoveDirective } from '../../events/hover-move.directive';
import { DotDatum, DotsComponent } from '../dots.component';
import { DotsEventOutput } from './dots-event-output';
import { dotsTooltipMixin } from './dots-tooltip';

@Directive({
  selector: '[vicDotsHoverMoveActions]',
})
export class DotsHoverMoveDirective<
  Datum,
  Color extends string | number,
  Radius extends string | number,
  TDotsComponent extends DotsComponent<Datum> = DotsComponent<Datum>,
> extends dotsTooltipMixin(HoverMoveDirective) {
  @Input('vicDotsHoverMoveActions')
  actions: HoverMoveAction<
    DotsHoverMoveDirective<Datum, Color, Radius, TDotsComponent>
  >[];
  @Output('vicDotsHoverMoveOutput') eventOutput = new EventEmitter<
    DotsEventOutput<Datum, Color, Radius>
  >();
  dotDatum: DotDatum<Color, Radius>;
  elRef: ElementRef;
  pointerX: number;
  pointerY: number;

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
    if (!this.preventAction) {
      this.dotDatum = this.getDotDatum(event);
      this.elRef = new ElementRef(event.target);
    }
    if (this.actions && !this.preventAction) {
      this.actions.forEach((action) => {
        if (action.initialize) {
          action.initialize(this);
        }
      });
    }
  }

  getDotDatum(event: PointerEvent): DotDatum<Color, Radius> {
    return select(event.target as SVGCircleElement).datum() as DotDatum<
      Color,
      Radius
    >;
  }

  onElementPointerMove(event: PointerEvent) {
    [this.pointerX, this.pointerY] = this.getPointerValuesArray(event);
    if (this.actions && !this.preventAction) {
      this.actions.forEach((action) => action.onStart(this));
    }
  }

  onElementPointerLeave() {
    if (this.actions && !this.preventAction) {
      this.actions.forEach((action) => action.onEnd(this));
    }
    this.dotDatum = undefined;
    this.elRef = undefined;
  }

  getEventOutput(): DotsEventOutput<Datum, Color, Radius> {
    const tooltipData = this.getDotsTooltipData(
      this.dotDatum,
      this.elRef,
      this.dots
    );
    const extras = {
      positionX: this.pointerX,
      positionY: this.pointerY,
    };
    return { ...tooltipData, ...extras };
  }
}

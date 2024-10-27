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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { select } from 'd3';
import { filter, Observable } from 'rxjs';
import { EventAction } from '../../events/action';
import { ClickDirective } from '../../events/click.directive';
import { DotDatum, DOTS, DotsComponent } from '../dots.component';
import { DotsEventDirective } from './dots-event-directive';
import { DotsEventOutput } from './dots-event-output';
import { DotsHoverMoveDirective } from './dots-hover-move.directive';
import { DotsHoverDirective } from './dots-hover.directive';
import { DotsInputEventDirective } from './dots-input.directive';

@Directive({
  selector: '[vicDotsClickActions]',
})
export class DotsClickDirective<
  Datum,
  TDotsComponent extends DotsComponent<Datum> = DotsComponent<Datum>,
> extends ClickDirective {
  @Input('vicDotsClickActions')
  actions: EventAction<DotsClickDirective<Datum, TDotsComponent>>[];
  @Input('vicDotsClickRemoveEvent$')
  override clickRemoveEvent$: Observable<void>;
  @Output('vicDotsClickOutput') eventOutput = new EventEmitter<
    DotsEventOutput<Datum>
  >();
  dotDatum: DotDatum;
  elRef: ElementRef;
  pointerX: number;
  pointerY: number;

  constructor(
    @Inject(DOTS) public dots: TDotsComponent,
    @Self()
    @Optional()
    public hoverDirective?: DotsHoverDirective<Datum, TDotsComponent>,
    @Self()
    @Optional()
    public hoverAndMoveDirective?: DotsHoverMoveDirective<
      Datum,
      TDotsComponent
    >,
    @Self()
    @Optional()
    public inputEventDirective?: DotsInputEventDirective<Datum, TDotsComponent>
  ) {
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

  onElementClick(event: PointerEvent): void {
    this.dotDatum = select(
      event.target as SVGCircleElement
    ).datum() as DotDatum;
    this.elRef = new ElementRef(event.target);
    [this.pointerX, this.pointerY] = this.getPointerValuesArray(event);
    if (this.hoverDirective) {
      this.pointerX = this.hoverDirective.positionX;
      this.pointerY = this.hoverDirective.positionY;
    }
    this.actions.forEach((action) => action.onStart(this));
  }

  onClickRemove(): void {
    this.actions.forEach((action) => action.onEnd(this));
    this.dotDatum = undefined;
    this.elRef = undefined;
    this.pointerX = undefined;
    this.pointerY = undefined;
  }

  getEventOutput(): DotsEventOutput<Datum> {
    const data = this.dots.getTooltipData(this.dotDatum, this.elRef);
    const extras = {
      positionX: this.pointerX,
      positionY: this.pointerY,
    };
    return { ...data, ...extras };
  }

  disableHoverActions(): void {
    const hoverEventDirectives = [
      this.hoverDirective,
      this.hoverAndMoveDirective,
    ];
    hoverEventDirectives.forEach((directive) => this.disableAction(directive));
  }

  resumeHoverActions(cancelCurrentActions = true): void {
    const hoverEventDirectives = [
      this.hoverDirective,
      this.hoverAndMoveDirective,
    ];
    hoverEventDirectives.forEach((directive) =>
      this.enableAction(directive, cancelCurrentActions)
    );
  }

  preventInputEventActions(): void {
    this.disableAction(this.inputEventDirective);
  }

  resumeInputEventActions(cancelCurrentActions = true): void {
    this.enableAction(this.inputEventDirective, cancelCurrentActions);
  }

  disableAction(directive: DotsEventDirective<Datum, TDotsComponent>): void {
    if (directive) {
      directive.preventAction = true;
    }
  }

  enableAction(
    directive: DotsEventDirective<Datum, TDotsComponent>,
    cancelCurrentActions: boolean
  ): void {
    if (directive) {
      directive.preventAction = false;
      if (cancelCurrentActions) {
        directive.actions.forEach((action) => action.onEnd(directive));
      }
    }
  }
}

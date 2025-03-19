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
import { Observable } from 'rxjs';
import { EventAction } from '../../events/action';
import { ClickDirective } from '../../events/click.directive';
import { ListenElement } from '../../events/event.directive';
import { LINES, LinesComponent } from '../lines.component';
import { LinesEventDirective } from './lines-event-directive';
import { LinesEventOutput } from './lines-event-output';
import { LinesHoverMoveDirective } from './lines-hover-move.directive';
import { LinesHoverDirective } from './lines-hover.directive';
import { LinesInputEventDirective } from './lines-input-event.directive';

/**
 * A directive that allows users to provide custom actions on click events on lines markers.
 *
 * Directive output ('vicLinesMarkerClickOutput') emits a LinesEmittedOutput object.
 */
@Directive({
  selector: '[vicLinesMarkerClickActions]',
  standalone: false,
})
export class LinesMarkerClickDirective<
  Datum,
  ExtendedLinesComponent extends LinesComponent<Datum> = LinesComponent<Datum>,
> extends ClickDirective {
  /**
   * An array of user-provided [EventAction]{@link EventAction} instances.
   *
   * The `onStart` method will be called on click. The `onEnd` method will be
   *  called when the `clickRemoveEvent$` Observable emits.
   */
  @Input('vicLinesMarkerClickActions')
  actions: EventAction<
    LinesMarkerClickDirective<Datum, ExtendedLinesComponent>
  >[];
  /**
   * A user-provided `Observable<void>` that triggers the `onEnd` method of all user-provided
   *  [EventAction]{@link EventAction} instances.
   *
   * Note that no `onEnd` method will be called if this input is not provided.
   */
  @Input('vicLinesMarkerClickRemoveEvent$')
  override clickRemoveEvent$: Observable<void>;
  /**
   * An `EventEmitter` that emits a [LinesEmittedOutput]{@link VicLinesEventOutput} object if
   *  an `onStart` or a `onEnd` method calls `next` on it.
   */
  @Output('vicLinesMarkerClickOutput') eventOutput = new EventEmitter<
    LinesEventOutput<Datum>
  >();
  /**
   * The index of the point that was clicked in the LinesComponent's values array.
   */
  pointIndex: number;

  constructor(
    @Inject(LINES) public lines: ExtendedLinesComponent,
    @Self()
    @Optional()
    public hoverDirective?: LinesHoverDirective<Datum, ExtendedLinesComponent>,
    @Self()
    @Optional()
    public hoverAndMoveDirective?: LinesHoverMoveDirective<
      Datum,
      ExtendedLinesComponent
    >,
    @Self()
    @Optional()
    public inputEventDirective?: LinesInputEventDirective<
      Datum,
      ExtendedLinesComponent
    >
  ) {
    super();
  }

  setListenedElements(): void {
    this.elements = Array.from(
      this.lines.chart.svgRef.nativeElement.querySelectorAll(
        `.${this.lines.class.marker}`
      )
    );
    this.setListeners();
  }

  onElementClick(event: PointerEvent, el: ListenElement): void {
    this.el = el;
    this.pointIndex = +el.getAttribute(this.lines.markerIndexAttr);
    this.actions.forEach((action) => action.onStart(this));
  }

  onClickRemove(): void {
    this.actions.forEach((action) => action.onEnd(this));
  }

  getTooltipData(): LinesEventOutput<Datum> {
    const data = this.lines.getTooltipData(this.pointIndex);
    return data;
  }

  preventHoverActions(): void {
    const hoverEventDirectives = [
      this.hoverDirective,
      this.hoverAndMoveDirective,
    ];
    hoverEventDirectives.forEach((directive) => this.disableAction(directive));
  }

  resumeHoverActions(): void {
    const hoverEventDirectives = [
      this.hoverDirective,
      this.hoverAndMoveDirective,
    ];
    hoverEventDirectives.forEach((directive) => this.enableAction(directive));
  }

  preventInputEventActions(): void {
    this.disableAction(this.inputEventDirective);
  }

  resumeInputEventActions(): void {
    this.enableAction(this.inputEventDirective);
  }

  disableAction(
    directive: LinesEventDirective<Datum, ExtendedLinesComponent>
  ): void {
    if (directive) {
      directive.preventAction = true;
    }
  }

  enableAction(
    directive: LinesEventDirective<Datum, ExtendedLinesComponent>
  ): void {
    if (directive) {
      directive.preventAction = false;
      directive.actions.forEach((action) => action.onEnd(directive));
    }
  }
}

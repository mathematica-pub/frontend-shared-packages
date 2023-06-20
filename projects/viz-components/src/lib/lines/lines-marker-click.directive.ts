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
import { ClickEventDirective } from '../events/click-event';
import { EventEffect } from '../events/effect';
import { ListenElement } from '../events/event';
import { LinesHoverAndMoveDirective } from './lines-hover-move.directive';
import { LinesHoverDirective } from './lines-hover.directive';
import { LinesInputEventDirective } from './lines-input-event.directive';
import {
  getLinesTooltipDataFromDatum,
  LinesEmittedOutput,
} from './lines-tooltip-data';
import { LINES, LinesComponent } from './lines.component';

type LinesEventDirective =
  | LinesHoverDirective
  | LinesHoverAndMoveDirective
  | LinesInputEventDirective;

/**
 * A directive that allows users to provide custom effects on click events on lines markers.
 *
 * Directive output ('vicLinesMarkerClickOutput') emits a LinesEmittedOutput object.
 */
@Directive({
  selector: '[vicLinesMarkerClickEffects]',
})
export class LinesMarkerClickDirective extends ClickEventDirective {
  /**
   * An array of user-provided [EventEffect]{@link EventEffect} instances.
   *
   * The `applyEffect` method will be called on click. The `removeEffect` method will be
   *  called when the `clickRemoveEvent$` Observable emits.
   */
  @Input('vicLinesMarkerClickEffects')
  effects: EventEffect<LinesMarkerClickDirective>[];
  /**
   * A user-provided `Observable<void>` that triggers the `removeEffect` method of all user-provided
   *  [EventEffect]{@link EventEffect} instances.
   *
   * Note that no `removeEffect` method will be called if this input is not provided.
   */
  @Input('vicLinesMarkerClickRemoveEvent$')
  override clickRemoveEvent$: Observable<void>;
  /**
   * An `EventEmitter` that emits a [LinesEmittedOutput]{@link LinesEmittedOutput} object if
   *  an `applyEffect` or a `removeEffect` method calls `next` on it.
   */
  @Output('vicLinesMarkerClickOutput') eventOutput =
    new EventEmitter<LinesEmittedOutput>();
  /**
   * The index of the point that was clicked in the LinesComponent's values array.
   */
  pointIndex: number;

  constructor(
    @Inject(LINES) public lines: LinesComponent,
    @Self()
    @Optional()
    public hoverDirective?: LinesHoverDirective,
    @Self()
    @Optional()
    public hoverAndMoveDirective?: LinesHoverAndMoveDirective,
    @Self()
    @Optional()
    public inputEventDirective?: LinesInputEventDirective
  ) {
    super();
  }

  setListenedElements(): void {
    this.elements = Array.from(
      this.lines.chart.svgRef.nativeElement.querySelectorAll(
        `.${this.lines.markerClass}`
      )
    );
    this.setListeners();
  }

  onElementClick(event: PointerEvent, el: ListenElement): void {
    this.el = el;
    this.pointIndex = +el.getAttribute(this.lines.markerIndexAttr);
    this.effects.forEach((effect) => effect.applyEffect(this));
  }

  onClickRemove(): void {
    this.effects.forEach((effect) => effect.removeEffect(this));
  }

  getTooltipData(): LinesEmittedOutput {
    const data = getLinesTooltipDataFromDatum(this.pointIndex, this.lines);
    return data;
  }

  preventHoverEffects(): void {
    const hoverEventDirectives = [
      this.hoverDirective,
      this.hoverAndMoveDirective,
    ];
    hoverEventDirectives.forEach((directive) => this.disableEffect(directive));
  }

  resumeHoverEffects(): void {
    const hoverEventDirectives = [
      this.hoverDirective,
      this.hoverAndMoveDirective,
    ];
    hoverEventDirectives.forEach((directive) => this.enableEffect(directive));
  }

  preventInputEventEffects(): void {
    this.disableEffect(this.inputEventDirective);
  }

  resumeInputEventEffects(): void {
    this.enableEffect(this.inputEventDirective);
  }

  disableEffect(directive: LinesEventDirective): void {
    if (directive) {
      directive.preventEffect = true;
    }
  }

  enableEffect(directive: LinesEventDirective): void {
    if (directive) {
      directive.preventEffect = false;
      directive.effects.forEach((effect) => effect.removeEffect(directive));
    }
  }
}

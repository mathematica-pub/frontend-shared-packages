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
import { ClickDirective } from '../../events/click.directive';
import { EventEffect } from '../../events/effect';
import { ListenElement } from '../../events/event.directive';
import { LINES, LinesComponent } from '../lines.component';
import { LinesEventDirective } from './lines-event-directive';
import { LinesEventOutput } from './lines-event-output';
import { LinesHoverMoveDirective } from './lines-hover-move.directive';
import { LinesHoverDirective } from './lines-hover.directive';
import { LinesInputEventDirective } from './lines-input-event.directive';
import { linesTooltipMixin } from './lines-tooltip-data';

/**
 * A directive that allows users to provide custom effects on click events on lines markers.
 *
 * Directive output ('vicLinesMarkerClickOutput') emits a LinesEmittedOutput object.
 */
@Directive({
  selector: '[vicLinesMarkerClickEffects]',
})
export class LinesMarkerClickDirective<
  Datum,
  ExtendedLinesComponent extends LinesComponent<Datum> = LinesComponent<Datum>,
> extends linesTooltipMixin(ClickDirective) {
  /**
   * An array of user-provided [EventEffect]{@link EventEffect} instances.
   *
   * The `applyEffect` method will be called on click. The `removeEffect` method will be
   *  called when the `clickRemoveEvent$` Observable emits.
   */
  @Input('vicLinesMarkerClickEffects')
  effects: EventEffect<
    LinesMarkerClickDirective<Datum, ExtendedLinesComponent>
  >[];
  /**
   * A user-provided `Observable<void>` that triggers the `removeEffect` method of all user-provided
   *  [EventEffect]{@link EventEffect} instances.
   *
   * Note that no `removeEffect` method will be called if this input is not provided.
   */
  @Input('vicLinesMarkerClickRemoveEvent$')
  override clickRemoveEvent$: Observable<void>;
  /**
   * An `EventEmitter` that emits a [LinesEmittedOutput]{@link VicLinesEventOutput} object if
   *  an `applyEffect` or a `removeEffect` method calls `next` on it.
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

  getTooltipData(): LinesEventOutput<Datum> {
    const data = this.getLinesTooltipData(this.pointIndex, this.lines);
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

  disableEffect(
    directive: LinesEventDirective<Datum, ExtendedLinesComponent>
  ): void {
    if (directive) {
      directive.preventEffect = true;
    }
  }

  enableEffect(
    directive: LinesEventDirective<Datum, ExtendedLinesComponent>
  ): void {
    if (directive) {
      directive.preventEffect = false;
      directive.effects.forEach((effect) => effect.removeEffect(directive));
    }
  }
}

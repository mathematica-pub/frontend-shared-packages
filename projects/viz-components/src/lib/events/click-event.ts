/* eslint-disable @angular-eslint/no-input-rename */
import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { pointer } from 'd3';
import { Observable, Subject, takeUntil } from 'rxjs';
import { EventDirective, ListenElement, UnlistenFunction } from './event';

/**
 * A directive that listens for click events on a set of elements, intended to be used
 *  with one or more user-provided [EventEffect]{@link EventEffect}.
 *
 * In order to trigger the `removeEffect` method of the [EventEffect]{@link EventEffect},
 *  a user must supply an `Observable<void>` to the `clickRemoveEvent$` input.
 */
@Directive()
export abstract class ClickEventDirective
  extends EventDirective
  implements OnInit, OnDestroy
{
  /**
   * An `Observable<void>` that triggers the `removeEffect` method of all user-provided
   *  [EventEffect]{@link EventEffect} instances.
   */
  @Input('vicDataMarksClickRemoveEvent$') clickRemoveEvent$: Observable<void>;
  unsubscribe: Subject<void> = new Subject();
  unlistenClick: UnlistenFunction[];
  el: ListenElement;

  abstract onElementClick(event: PointerEvent, el: ListenElement): void;
  abstract onClickRemove(): void;

  ngOnInit(): void {
    if (this.clickRemoveEvent$) {
      this.clickRemoveEvent$
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(() => this.onClickRemove());
    }
  }

  ngOnDestroy(): void {
    this.unlistenClick.forEach((func) => func());
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  setListeners(): void {
    this.setClickListeners();
  }

  setClickListeners(): void {
    this.unlistenClick = this.elements.map((el) =>
      this.renderer.listen(el, 'click', (event) => {
        this.onElementClick(event, el);
      })
    );
  }

  getPointerValuesArray(event: PointerEvent): [number, number] {
    return pointer(event);
  }
}

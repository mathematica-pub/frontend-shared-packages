/* eslint-disable @angular-eslint/no-input-rename */
import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { pointer } from 'd3';
import { Observable } from 'rxjs';
import {
  EventDirective,
  ListenElement,
  UnlistenFunction,
} from './event.directive';

/**
 * A directive that listens for click events on a set of elements, intended to be used
 *  with one or more user-provided [EventAction]{@link EventAction}.
 *
 * In order to trigger the `onEnd` method of the [EventAction]{@link EventAction},
 *  a user must supply an `Observable<void>` to the `clickRemoveEvent$` input.
 */
@Directive()
export abstract class ClickDirective
  extends EventDirective
  implements OnInit, OnDestroy
{
  /**
   * An `Observable<void>` that triggers the `onEnd` method of all user-provided
   *  [EventAction]{@link EventAction} instances.
   */
  @Input('vicDataMarksClickRemoveEvent$') clickRemoveEvent$: Observable<void>;
  unlistenClick: UnlistenFunction[];
  el: ListenElement;

  abstract onElementClick(event: PointerEvent, el: ListenElement): void;
  abstract onClickRemove(): void;

  ngOnInit(): void {
    if (this.clickRemoveEvent$) {
      this.clickRemoveEvent$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.onClickRemove());
    }
  }

  ngOnDestroy(): void {
    this.unlistenClick.forEach((func) => func());
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

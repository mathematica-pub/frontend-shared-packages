import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { pointer } from 'd3';
import { Observable, Subject, takeUntil } from 'rxjs';
import { EventDirective, ListenElement, UnlistenFunction } from './event';

@Directive()
export abstract class ClickEventDirective
  extends EventDirective
  implements OnInit, OnDestroy
{
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('vicDataMarksClickRemoveEvent$') clickRemoveEvent$: Observable<void>;
  unsubscribe: Subject<void> = new Subject();
  unlistenClick: UnlistenFunction[];
  el: ListenElement;

  abstract onElementClick(event: PointerEvent, el: ListenElement): void;
  abstract onClickRemove(): void;

  ngOnInit(): void {
    this.clickRemoveEvent$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => this.onClickRemove());
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

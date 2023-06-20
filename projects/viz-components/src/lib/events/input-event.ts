/* eslint-disable @angular-eslint/no-input-rename */
import { Directive, Input, OnInit } from '@angular/core';
import { Observable, takeUntil } from 'rxjs';
import { Unsubscribe } from '../shared/unsubscribe.class';

@Directive()
export abstract class InputEventDirective
  extends Unsubscribe
  implements OnInit
{
  @Input('vicDataMarksInputEvent$') inputEvent$: Observable<any>;
  preventEffect = false;

  abstract handleNewEvent(event: Event): void;

  ngOnInit(): void {
    if (this.inputEvent$) {
      this.inputEvent$
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((event) => this.handleNewEvent(event));
    }
  }
}

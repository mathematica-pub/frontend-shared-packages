/* eslint-disable @angular-eslint/no-input-rename */
import { DestroyRef, Directive, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

@Directive()
export abstract class InputEventDirective implements OnInit {
  @Input('vicDataMarksInputEvent$') inputEvent$: Observable<any>;
  preventEffect = false;

  abstract handleNewEvent(event: Event): void;

  constructor(private destroyRef: DestroyRef) {}

  ngOnInit(): void {
    if (this.inputEvent$) {
      this.inputEvent$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((event) => this.handleNewEvent(event));
    }
  }
}

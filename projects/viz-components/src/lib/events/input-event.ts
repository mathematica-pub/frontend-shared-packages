import { Directive, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Directive()
export abstract class InputEvent implements OnInit {
  @Input() inputEvent$: Observable<any>;

  abstract handleNewEvent: (event: any) => void;

  ngOnInit(): void {
    this.inputEvent$.subscribe((event) => this.handleNewEvent(event));
  }
}

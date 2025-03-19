/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/no-output-rename */
import {
  DestroyRef,
  Directive,
  EventEmitter,
  Inject,
  Input,
  Output,
} from '@angular/core';
import { Observable } from 'rxjs';
import { InputEventAction } from '../../events/action';
import { InputEventDirective } from '../../events/input-event.directive';
import { DOTS, DotsComponent } from '../dots.component';

@Directive({
  selector: '[vicDotsInputEventActions]',
  standalone: false,
})
export class DotsInputEventDirective<
  Datum,
  TDotsComponent extends DotsComponent<Datum> = DotsComponent<Datum>,
> extends InputEventDirective {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('vicDotsInputEventActions')
  actions: InputEventAction<DotsInputEventDirective<Datum, TDotsComponent>>[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input('vicDotsInputEvent$') override inputEvent$: Observable<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output('vicDotsInputEventOutput') eventOutput = new EventEmitter<any>();

  constructor(
    destroyRef: DestroyRef,
    @Inject(DOTS) public bars: DotsComponent<Datum>
  ) {
    super(destroyRef);
  }

  handleNewEvent(inputEvent: Event): void {
    if (inputEvent) {
      this.actions.forEach((action) => action.onStart(this, inputEvent));
    } else {
      this.actions.forEach((action) => action.onEnd(this, inputEvent));
    }
  }
}

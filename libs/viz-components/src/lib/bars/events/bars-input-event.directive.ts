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
import { DataValue } from '../../core/types/values';
import { InputEventAction } from '../../events/action';
import { InputEventDirective } from '../../events/input-event.directive';
import { BARS, BarsComponent } from '../bars.component';

@Directive({
  selector: '[vicBarsInputEventActions]',
})
export class BarsInputEventDirective<
  Datum,
  TOrdinalValue extends DataValue,
  TBarsComponent extends BarsComponent<Datum, TOrdinalValue> = BarsComponent<
    Datum,
    TOrdinalValue
  >,
> extends InputEventDirective {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('vicBarsInputEventActions')
  actions: InputEventAction<
    BarsInputEventDirective<Datum, TOrdinalValue, TBarsComponent>
  >[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input('vicBarsInputEvent$') override inputEvent$: Observable<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output('vicBarsInputEventOutput') eventOutput = new EventEmitter<any>();

  constructor(
    destroyRef: DestroyRef,
    @Inject(BARS) public bars: BarsComponent<Datum, TOrdinalValue>
  ) {
    super(destroyRef);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleNewEvent(inputEvent: any): void {
    if (inputEvent) {
      this.actions.forEach((action) => action.onStart(this, inputEvent));
    } else {
      this.actions.forEach((action) => action.onEnd(this, inputEvent));
    }
  }
}

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
import { STACKED_BARS, StackedBarsComponent } from '../stacked-bars.component';

@Directive({
  selector: '[vicStackedBarsInputEventActions]',
})
export class StackedBarsInputEventDirective<
  Datum,
  OrdinalDomain extends DataValue,
  ChartMultipleDomain extends DataValue = string,
  TStackedBarsComponent extends StackedBarsComponent<
    Datum,
    OrdinalDomain,
    ChartMultipleDomain
  > = StackedBarsComponent<Datum, OrdinalDomain, ChartMultipleDomain>,
> extends InputEventDirective {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('vicStackedBarsInputEventActions')
  actions: InputEventAction<
    StackedBarsInputEventDirective<
      Datum,
      OrdinalDomain,
      ChartMultipleDomain,
      TStackedBarsComponent
    >
  >[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input('vicStackedBarsInputEvent$') override inputEvent$: Observable<any>;
  @Output('vicStackedBarsInputEventOutput') eventOutput =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new EventEmitter<any>();

  constructor(
    destroyRef: DestroyRef,
    @Inject(STACKED_BARS)
    public bars: StackedBarsComponent<Datum, OrdinalDomain, ChartMultipleDomain>
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

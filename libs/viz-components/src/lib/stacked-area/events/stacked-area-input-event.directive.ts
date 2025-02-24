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
import { STACKED_AREA, StackedAreaComponent } from '../stacked-area.component';

@Directive({
  selector: '[vicStackedAreaInputActions]',
})
export class StackedAreaInputEventDirective<
  Datum,
  CategoricalDomain extends DataValue,
  ChartMultipleDomain extends DataValue = string,
  TStackedAreaComponent extends StackedAreaComponent<
    Datum,
    CategoricalDomain,
    ChartMultipleDomain
  > = StackedAreaComponent<Datum, CategoricalDomain, ChartMultipleDomain>,
> extends InputEventDirective {
  @Input('vicStackedAreaInputActions')
  actions: InputEventAction<
    StackedAreaInputEventDirective<
      Datum,
      CategoricalDomain,
      ChartMultipleDomain,
      TStackedAreaComponent
    >
  >[];
  @Input('vicStackedAreaInputEvent$') override inputEvent$: Observable<unknown>;
  @Output('vicStackedAreaInputEventOutput') eventOutput =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new EventEmitter<any>();

  constructor(
    destroyRef: DestroyRef,
    @Inject(STACKED_AREA) public areas: TStackedAreaComponent
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

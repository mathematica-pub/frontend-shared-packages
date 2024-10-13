import {
  DestroyRef,
  Directive,
  EventEmitter,
  Inject,
  Input,
  Output,
} from '@angular/core';
import { Geometry } from 'geojson';
import { Observable } from 'rxjs';
import { InputEventAction } from '../../events/action';
import { InputEventDirective } from '../../events/input-event.directive';
import { GEOGRAPHIES, GeographiesComponent } from '../geographies.component';

@Directive({
  selector: '[vicGeographiesInputActions]',
})
export class GeographiesInputEventDirective<
  Datum,
  TProperties,
  TGeometry extends Geometry,
  TComponent extends GeographiesComponent<
    Datum,
    TProperties,
    TGeometry
  > = GeographiesComponent<Datum, TProperties, TGeometry>,
> extends InputEventDirective {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('vicGeographiesInputEventActions')
  actions: InputEventAction<
    GeographiesInputEventDirective<Datum, TProperties, TGeometry, TComponent>
  >[];
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('vicGeographiesInputEvent$') override inputEvent$: Observable<unknown>;
  @Output() inputEventOutput = new EventEmitter<unknown>();

  constructor(
    @Inject(GEOGRAPHIES) public geographies: TComponent,
    destroyRef: DestroyRef
  ) {
    super(destroyRef);
  }

  handleNewEvent(inputEvent: unknown): void {
    if (inputEvent) {
      this.actions.forEach((action) => action.onStart(this, inputEvent));
    } else {
      this.actions.forEach((action) => action.onEnd(this, inputEvent));
    }
  }
}

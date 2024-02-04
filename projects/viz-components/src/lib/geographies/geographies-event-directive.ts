import { GeographiesHoverMoveDirective } from './geographies-hover-move.directive';
import { GeographiesHoverDirective } from './geographies-hover.directive';
import { GeographiesInputEventDirective } from './geographies-input-event.directive';
import { GeographiesComponent } from './geographies.component';

export type GeographiesEventDirective<
  T,
  U extends GeographiesComponent<T> = GeographiesComponent<T>
> =
  | GeographiesHoverDirective<T, U>
  | GeographiesHoverMoveDirective<T, U>
  | GeographiesInputEventDirective<T, U>;

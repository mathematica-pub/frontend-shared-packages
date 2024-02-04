import { BarsHoverMoveDirective } from './bars-hover-move.directive';
import { BarsHoverDirective } from './bars-hover.directive';
import { BarsInputEventDirective } from './bars-input-event.directive';
import { BarsComponent } from './bars.component';

export type BarsEventDirective<
  T,
  U extends BarsComponent<T> = BarsComponent<T>
> =
  | BarsHoverDirective<T, U>
  | BarsHoverMoveDirective<T, U>
  | BarsInputEventDirective<T, U>;

import { LinesHoverMoveDirective } from './lines-hover-move.directive';
import { LinesHoverDirective } from './lines-hover.directive';
import { LinesInputEventDirective } from './lines-input-event.directive';
import { LinesComponent } from './lines.component';

export type LinesEventDirective<
  T,
  U extends LinesComponent<T> = LinesComponent<T>
> =
  | LinesHoverDirective<T, U>
  | LinesHoverMoveDirective<T, U>
  | LinesInputEventDirective<T, U>;

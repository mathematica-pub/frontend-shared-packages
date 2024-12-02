import { DotsComponent } from '../dots.component';
import { DotsHoverMoveDirective } from './dots-hover-move.directive';
import { DotsHoverDirective } from './dots-hover.directive';
import { DotsInputEventDirective } from './dots-input.directive';

export type DotsEventDirective<
  Datum,
  TDotsComponent extends DotsComponent<Datum> = DotsComponent<Datum>,
> =
  | DotsHoverDirective<Datum, TDotsComponent>
  | DotsHoverMoveDirective<Datum, TDotsComponent>
  | DotsInputEventDirective<Datum, TDotsComponent>;

import { BarsHoverMoveDirective } from './bars-hover-move.directive';
import { BarsHoverDirective } from './bars-hover.directive';
import { BarsInputEventDirective } from './bars-input-event.directive';
import { BarsComponent } from './bars.component';

export type BarsEventDirective<
  Datum,
  ExtendedBarsComponent extends BarsComponent<Datum> = BarsComponent<Datum>
> =
  | BarsHoverDirective<Datum, ExtendedBarsComponent>
  | BarsHoverMoveDirective<Datum, ExtendedBarsComponent>
  | BarsInputEventDirective<Datum, ExtendedBarsComponent>;

import { VicDataValue } from '../../public-api';
import { BarsHoverMoveDirective } from './bars-hover-move.directive';
import { BarsHoverDirective } from './bars-hover.directive';
import { BarsInputEventDirective } from './bars-input-event.directive';
import { BarsComponent } from './bars.component';

export type BarsEventDirective<
  Datum,
  TOrdinalValue extends VicDataValue,
  TBarsComponent extends BarsComponent<Datum, TOrdinalValue> = BarsComponent<
    Datum,
    TOrdinalValue
  >
> =
  | BarsHoverDirective<Datum, TOrdinalValue, TBarsComponent>
  | BarsHoverMoveDirective<Datum, TOrdinalValue, TBarsComponent>
  | BarsInputEventDirective<Datum, TOrdinalValue, TBarsComponent>;

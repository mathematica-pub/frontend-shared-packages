import { DataValue } from '../../core';
import { StackedBarsComponent } from '../stacked-bars.component';
import { StackedBarsHoverMoveDirective } from './stacked-bars-hover-move.directive';
import { StackedBarsHoverDirective } from './stacked-bars-hover.directive';
import { StackedBarsInputEventDirective } from './stacked-bars-input-event.directive';

export type StackedBarsEventDirective<
  Datum,
  TOrdinalValue extends DataValue,
  TStackedBarsComponent extends StackedBarsComponent<
    Datum,
    TOrdinalValue
  > = StackedBarsComponent<Datum, TOrdinalValue>,
> =
  | StackedBarsHoverDirective<Datum, TOrdinalValue, TStackedBarsComponent>
  | StackedBarsHoverMoveDirective<Datum, TOrdinalValue, TStackedBarsComponent>
  | StackedBarsInputEventDirective<Datum, TOrdinalValue, TStackedBarsComponent>;

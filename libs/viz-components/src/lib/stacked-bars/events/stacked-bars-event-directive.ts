import { DataValue } from '../../core';
import { StackedBarsComponent } from '../stacked-bars.component';
import { StackedBarsHoverMoveDirective } from './stacked-bars-hover-move.directive';
import { StackedBarsHoverDirective } from './stacked-bars-hover.directive';
import { StackedBarsInputEventDirective } from './stacked-bars-input-event.directive';

export type StackedBarsEventDirective<
  Datum,
  OrdinalDomain extends DataValue,
  ChartMultipleDomain extends DataValue,
  TStackedBarsComponent extends StackedBarsComponent<
    Datum,
    OrdinalDomain,
    ChartMultipleDomain
  > = StackedBarsComponent<Datum, OrdinalDomain, ChartMultipleDomain>,
> =
  | StackedBarsHoverDirective<
      Datum,
      OrdinalDomain,
      ChartMultipleDomain,
      TStackedBarsComponent
    >
  | StackedBarsHoverMoveDirective<
      Datum,
      OrdinalDomain,
      ChartMultipleDomain,
      TStackedBarsComponent
    >
  | StackedBarsInputEventDirective<
      Datum,
      OrdinalDomain,
      ChartMultipleDomain,
      TStackedBarsComponent
    >;

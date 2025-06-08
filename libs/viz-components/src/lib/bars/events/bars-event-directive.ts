import { DataValue } from '../../core/types/values';
import { BarsComponent } from '../bars.component';
import { BarsHoverMoveDirective } from './bars-hover-move.directive';
import { BarsHoverDirective } from './bars-hover.directive';
import { BarsInputEventDirective } from './bars-input-event.directive';

export type BarsEventDirective<
  Datum,
  OrdinalDomain extends DataValue,
  ChartMultipleDomain extends DataValue,
  TBarsComponent extends BarsComponent<
    Datum,
    OrdinalDomain,
    ChartMultipleDomain
  > = BarsComponent<Datum, OrdinalDomain, ChartMultipleDomain>,
> =
  | BarsHoverDirective<
      Datum,
      OrdinalDomain,
      ChartMultipleDomain,
      TBarsComponent
    >
  | BarsHoverMoveDirective<
      Datum,
      OrdinalDomain,
      ChartMultipleDomain,
      TBarsComponent
    >
  | BarsInputEventDirective<
      Datum,
      OrdinalDomain,
      ChartMultipleDomain,
      TBarsComponent
    >;

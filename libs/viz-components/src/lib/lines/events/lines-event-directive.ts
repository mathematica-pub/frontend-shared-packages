import { DataValue } from '../../core/types/values';
import { LinesComponent } from '../lines.component';
import { LinesHoverMoveDirective } from './lines-hover-move.directive';
import { LinesHoverDirective } from './lines-hover.directive';
import { LinesInputEventDirective } from './lines-input-event.directive';

export type LinesEventDirective<
  Datum,
  ChartMultipleDomain extends DataValue,
  TLinesComponent extends LinesComponent<
    Datum,
    ChartMultipleDomain
  > = LinesComponent<Datum, ChartMultipleDomain>,
> =
  | LinesHoverDirective<Datum, ChartMultipleDomain, TLinesComponent>
  | LinesHoverMoveDirective<Datum, ChartMultipleDomain, TLinesComponent>
  | LinesInputEventDirective<Datum, ChartMultipleDomain, TLinesComponent>;

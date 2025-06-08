import { DataValue } from '../../core';
import { DotsComponent } from '../dots.component';
import { DotsHoverMoveDirective } from './dots-hover-move.directive';
import { DotsHoverDirective } from './dots-hover.directive';
import { DotsInputEventDirective } from './dots-input.directive';

export type DotsEventDirective<
  Datum,
  XOrdinalDomain extends DataValue = string,
  YOrdinalDomain extends DataValue = string,
  ChartMultipleDomain extends DataValue = string,
  TDotsComponent extends DotsComponent<
    Datum,
    XOrdinalDomain,
    YOrdinalDomain,
    ChartMultipleDomain
  > = DotsComponent<Datum, XOrdinalDomain, YOrdinalDomain, ChartMultipleDomain>,
> =
  | DotsHoverDirective<
      Datum,
      XOrdinalDomain,
      YOrdinalDomain,
      ChartMultipleDomain,
      TDotsComponent
    >
  | DotsHoverMoveDirective<
      Datum,
      XOrdinalDomain,
      YOrdinalDomain,
      ChartMultipleDomain,
      TDotsComponent
    >
  | DotsInputEventDirective<
      Datum,
      XOrdinalDomain,
      YOrdinalDomain,
      ChartMultipleDomain,
      TDotsComponent
    >;

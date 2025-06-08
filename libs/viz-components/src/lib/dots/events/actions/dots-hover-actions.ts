import { DataValue } from '../../../core/types/values';
import { EventAction } from '../../../events';
import { DotsComponent } from '../../dots.component';
import { DotsHoverDirective } from '../dots-hover.directive';

export class DotsHoverDefaultStyles<
  Datum,
  XOrdinalDomain extends DataValue,
  YOrdinalDomain extends DataValue,
  ChartMultipleDomain extends DataValue,
  TDotsComponent extends DotsComponent<
    Datum,
    XOrdinalDomain,
    YOrdinalDomain,
    ChartMultipleDomain
  > = DotsComponent<Datum, XOrdinalDomain, YOrdinalDomain, ChartMultipleDomain>,
> implements
    EventAction<
      DotsHoverDirective<
        Datum,
        XOrdinalDomain,
        YOrdinalDomain,
        ChartMultipleDomain,
        TDotsComponent
      >
    >
{
  onStart(
    directive: DotsHoverDirective<
      Datum,
      XOrdinalDomain,
      YOrdinalDomain,
      ChartMultipleDomain,
      TDotsComponent
    >
  ): void {
    directive.dots.dotGroups
      .filter((d) => d.index !== directive.dotDatum.index)
      .selectAll<SVGCircleElement, number>('circle')
      .style('fill', '#ccc');
  }

  onEnd(
    directive: DotsHoverDirective<
      Datum,
      XOrdinalDomain,
      YOrdinalDomain,
      ChartMultipleDomain,
      TDotsComponent
    >
  ): void {
    directive.dots.dotGroups
      .selectAll<SVGCircleElement, number>('circle')
      .style('fill', null);
  }
}

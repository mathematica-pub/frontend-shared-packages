import { DataValue } from '../../../core';
import { HoverMoveAction } from '../../../events';
import { DotsComponent } from '../../dots.component';
import { DotsHoverMoveDirective } from '../dots-hover-move.directive';

export class DotsHoverMoveDefaultStyles<
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
> implements
    HoverMoveAction<
      DotsHoverMoveDirective<
        Datum,
        XOrdinalDomain,
        YOrdinalDomain,
        ChartMultipleDomain,
        TDotsComponent
      >
    >
{
  onStart(
    directive: DotsHoverMoveDirective<
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

    directive.dots.dotGroups
      .filter((d) => d.index === directive.dotDatum.index)
      .selectAll<SVGCircleElement, number>('circle')
      .select((d, i, nodes) => nodes[i].parentElement)
      .raise();
  }

  onEnd(
    directive: DotsHoverMoveDirective<
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

export class DotsHoverMoveEmitTooltipData<
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
    HoverMoveAction<
      DotsHoverMoveDirective<
        Datum,
        XOrdinalDomain,
        YOrdinalDomain,
        ChartMultipleDomain,
        TDotsComponent
      >
    >
{
  onStart(
    directive: DotsHoverMoveDirective<
      Datum,
      XOrdinalDomain,
      YOrdinalDomain,
      ChartMultipleDomain,
      TDotsComponent
    >
  ): void {
    const tooltipData = directive.getEventOutput();
    directive.eventOutput.emit(tooltipData);
  }

  onEnd(
    directive: DotsHoverMoveDirective<
      Datum,
      XOrdinalDomain,
      YOrdinalDomain,
      ChartMultipleDomain,
      TDotsComponent
    >
  ): void {
    directive.eventOutput.emit(null);
  }
}

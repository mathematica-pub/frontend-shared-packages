import { DataValue } from '../../../core/types/values';
import { EventAction } from '../../../events/action';
import { BarsComponent } from '../../bars.component';
import { BarsHoverDirective } from '../bars-hover.directive';

export class BarsHoverShowLabels<
  Datum,
  OrdinalDomain extends DataValue,
  ChartMultipleDomain extends DataValue = string,
  TBarsComponent extends BarsComponent<
    Datum,
    OrdinalDomain,
    ChartMultipleDomain
  > = BarsComponent<Datum, OrdinalDomain, ChartMultipleDomain>,
> implements
    EventAction<
      BarsHoverDirective<
        Datum,
        OrdinalDomain,
        ChartMultipleDomain,
        TBarsComponent
      >
    >
{
  onStart(
    directive: BarsHoverDirective<
      Datum,
      OrdinalDomain,
      ChartMultipleDomain,
      TBarsComponent
    >
  ): void {
    directive.bars.barGroups
      .filter((d) => d === directive.barDatum.index)
      .select('text')
      .style('display', null);
  }

  onEnd(
    directive: BarsHoverDirective<
      Datum,
      OrdinalDomain,
      ChartMultipleDomain,
      TBarsComponent
    >
  ): void {
    directive.bars.barGroups
      .filter((d) => d === directive.barDatum.index)
      .select('text')
      .style('display', 'none');
  }
}

export class BarsHoverEmitTooltipData<
  Datum,
  OrdinalDomain extends DataValue,
  ChartMultipleDomain extends DataValue,
> implements
    EventAction<BarsHoverDirective<Datum, OrdinalDomain, ChartMultipleDomain>>
{
  onStart(
    directive: BarsHoverDirective<Datum, OrdinalDomain, ChartMultipleDomain>
  ): void {
    const tooltipData = directive.getEventOutput();
    directive.eventOutput.emit(tooltipData);
  }

  onEnd(
    directive: BarsHoverDirective<Datum, OrdinalDomain, ChartMultipleDomain>
  ): void {
    directive.eventOutput.emit(null);
  }
}

import { DataValue } from '../../../core/types/values';
import { EventAction } from '../../../events/action';
import { BarsComponent } from '../../bars.component';
import { BarsHoverDirective } from '../bars-hover.directive';

export class BarsHoverShowLabels<
  Datum,
  TOrdinalValue extends DataValue,
  TBarsComponent extends BarsComponent<Datum, TOrdinalValue> = BarsComponent<
    Datum,
    TOrdinalValue
  >,
> implements
    EventAction<BarsHoverDirective<Datum, TOrdinalValue, TBarsComponent>>
{
  onStart(
    directive: BarsHoverDirective<Datum, TOrdinalValue, TBarsComponent>
  ): void {
    directive.bars.barGroups
      .filter((d) => d === directive.barDatum.index)
      .select('text')
      .style('display', null);
  }

  onEnd(
    directive: BarsHoverDirective<Datum, TOrdinalValue, TBarsComponent>
  ): void {
    directive.bars.barGroups
      .filter((d) => d === directive.barDatum.index)
      .select('text')
      .style('display', 'none');
  }
}

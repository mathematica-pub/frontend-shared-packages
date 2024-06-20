import { VicDataValue } from '../core/types/values';
import { EventEffect } from '../events/effect';
import { BarsHoverDirective } from './bars-hover.directive';
import { BarsComponent } from './bars.component';

export class BarsHoverShowLabels<
  Datum,
  TOrdinalValue extends VicDataValue,
  TBarsComponent extends BarsComponent<Datum, TOrdinalValue> = BarsComponent<
    Datum,
    TOrdinalValue
  >
> implements
    EventEffect<BarsHoverDirective<Datum, TOrdinalValue, TBarsComponent>>
{
  applyEffect(
    directive: BarsHoverDirective<Datum, TOrdinalValue, TBarsComponent>
  ): void {
    directive.bars.barGroups
      .filter((d) => d === directive.barDatum.index)
      .select('text')
      .style('display', null);
  }

  removeEffect(
    directive: BarsHoverDirective<Datum, TOrdinalValue, TBarsComponent>
  ): void {
    directive.bars.barGroups
      .filter((d) => d === directive.barDatum.index)
      .select('text')
      .style('display', 'none');
  }
}

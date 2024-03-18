import { EventEffect } from '../events/effect';
import { BarsHoverDirective } from './bars-hover.directive';
import { BarsComponent } from './bars.component';

export class BarsHoverShowLabels<
  Datum,
  ExtendedBarsComponent extends BarsComponent<Datum> = BarsComponent<Datum>
> implements EventEffect<BarsHoverDirective<Datum, ExtendedBarsComponent>>
{
  applyEffect(
    directive: BarsHoverDirective<Datum, ExtendedBarsComponent>
  ): void {
    directive.bars.barGroups
      .filter((d) => d === directive.barIndex)
      .select('text')
      .style('display', null);
  }

  removeEffect(
    directive: BarsHoverDirective<Datum, ExtendedBarsComponent>
  ): void {
    directive.bars.barGroups
      .filter((d) => d === directive.barIndex)
      .select('text')
      .style('display', 'none');
  }
}

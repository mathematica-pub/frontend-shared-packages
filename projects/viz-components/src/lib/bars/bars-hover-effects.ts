import { EventEffect } from '../events/effect';
import { BarsHoverDirective } from './bars-hover.directive';
import { BarsComponent } from './bars.component';

export class BarsHoverShowLabels<
  T,
  U extends BarsComponent<T> = BarsComponent<T>
> implements EventEffect<BarsHoverDirective<T, U>>
{
  applyEffect(directive: BarsHoverDirective<T, U>): void {
    directive.bars.barGroups
      .filter((d) => d === directive.barIndex)
      .select('text')
      .style('display', null);
  }

  removeEffect(directive: BarsHoverDirective<T, U>): void {
    directive.bars.barGroups
      .filter((d) => d === directive.barIndex)
      .select('text')
      .style('display', 'none');
  }
}

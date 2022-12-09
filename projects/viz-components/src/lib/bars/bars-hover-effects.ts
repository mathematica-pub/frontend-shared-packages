import { EventEffect } from '../events/effect';
import { BarsHoverEventDirective } from './bars-hover-event.directive';

export class BarsHoverEffectShowLabels
  implements EventEffect<BarsHoverEventDirective>
{
  applyEffect(directive: BarsHoverEventDirective): void {
    directive.bars.barGroups
      .filter((d) => d === directive.barIndex)
      .select('text')
      .style('display', null);
  }

  removeEffect(directive: BarsHoverEventDirective): void {
    directive.bars.barGroups
      .filter((d) => d === directive.barIndex)
      .select('text')
      .style('display', 'none');
  }
}

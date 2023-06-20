import { EventEffect } from '../events/effect';
import { BarsHoverDirective } from './bars-hover.directive';

export class BarsHoverShowLabels implements EventEffect<BarsHoverDirective> {
  applyEffect(directive: BarsHoverDirective): void {
    directive.bars.barGroups
      .filter((d) => d === directive.barIndex)
      .select('text')
      .style('display', null);
  }

  removeEffect(directive: BarsHoverDirective): void {
    directive.bars.barGroups
      .filter((d) => d === directive.barIndex)
      .select('text')
      .style('display', 'none');
  }
}

import { BarsHoverEventDirective } from './bars-hover-event.directive';

export class BarsHoverEffectDefaultBarsStyles
  implements EventEffect<BarsHoverEventDirective>
{
  applyEffect(directive: BarsHoverEventDirective) {
    console.log(directive);
  }

  removeEffect(directive: BarsHoverEventDirective) {}
}

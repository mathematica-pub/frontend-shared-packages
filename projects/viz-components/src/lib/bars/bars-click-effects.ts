import { VicDataValue } from '../../public-api';
import { EventEffect } from '../events/effect';
import { BarsClickDirective } from './bars-click.directive';

export class BarsClickEmitTooltipDataPauseHoverMoveEffects<
  Datum,
  TOrdinalValue extends VicDataValue
> implements EventEffect<BarsClickDirective<Datum, TOrdinalValue>>
{
  applyEffect(directive: BarsClickDirective<Datum, TOrdinalValue>) {
    const outputData = directive.getEventOutput();
    directive.preventHoverEffects();
    directive.eventOutput.emit(outputData);
  }

  removeEffect(directive: BarsClickDirective<Datum, TOrdinalValue>) {
    directive.resumeHoverEffects();
    directive.eventOutput.emit(null);
  }
}

import { DataValue } from '../../../core/types/values';
import { EventAction } from '../../../events/action';
import { StackedBarsComponent } from '../../stacked-bars.component';
import { StackedBarsHoverDirective } from '../stacked-bars-hover.directive';

export class StackedBarsHoverShowLabels<
  Datum,
  TOrdinalValue extends DataValue,
  TStackedBarsComponent extends StackedBarsComponent<
    Datum,
    TOrdinalValue
  > = StackedBarsComponent<Datum, TOrdinalValue>,
> implements
    EventAction<
      StackedBarsHoverDirective<Datum, TOrdinalValue, TStackedBarsComponent>
    >
{
  onStart(
    directive: StackedBarsHoverDirective<
      Datum,
      TOrdinalValue,
      TStackedBarsComponent
    >
  ): void {
    directive.bars.barGroups
      .filter((d) => d === directive.stackedBarDatum.i)
      .select('text')
      .style('display', null);
  }

  onEnd(
    directive: StackedBarsHoverDirective<
      Datum,
      TOrdinalValue,
      TStackedBarsComponent
    >
  ): void {
    directive.bars.barGroups
      .filter((d) => d === directive.stackedBarDatum.i)
      .select('text')
      .style('display', 'none');
  }
}

export class StackedBarsHoverEmitTooltipData<
  Datum,
  TOrdinalValue extends DataValue,
> implements EventAction<StackedBarsHoverDirective<Datum, TOrdinalValue>>
{
  onStart(directive: StackedBarsHoverDirective<Datum, TOrdinalValue>): void {
    const tooltipData = directive.getEventOutput();
    directive.eventOutput.emit(tooltipData);
  }

  onEnd(directive: StackedBarsHoverDirective<Datum, TOrdinalValue>): void {
    directive.eventOutput.emit(null);
  }
}

import { Directive, Inject, Input } from '@angular/core';
import { DataValue } from '../../core/types/values';
import { EventAction } from '../../events/action';
import { HoverDirective } from '../../events/hover.directive';
import { LINES, LinesComponent } from '../lines.component';

@Directive({
  selector: '[vicLinesHoverActions]',
})
export class LinesHoverDirective<
  Datum,
  ChartMultipleDomain extends DataValue = string,
  TLinesComponent extends LinesComponent<
    Datum,
    ChartMultipleDomain
  > = LinesComponent<Datum, ChartMultipleDomain>,
> extends HoverDirective {
  @Input('vicLinesHoverActions')
  actions: EventAction<LinesHoverDirective<Datum, ChartMultipleDomain>>[];

  constructor(@Inject(LINES) public lines: TLinesComponent) {
    super();
  }

  setListenedElements(): void {
    this.elements = [this.lines.chart.svgRef.nativeElement];
    this.setListeners();
  }

  onElementPointerEnter(): void {
    this.actions.forEach((action) => action.onStart(this));
  }

  onElementPointerLeave(): void {
    this.actions.forEach((action) => action.onEnd(this));
  }
}

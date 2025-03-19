import { Directive, Inject, Input } from '@angular/core';
import { EventAction } from '../../events/action';
import { HoverDirective } from '../../events/hover.directive';
import { LINES, LinesComponent } from '../lines.component';

@Directive({
  selector: '[vicLinesHoverActions]',
  standalone: false,
})
export class LinesHoverDirective<
  Datum,
  TLinesComponent extends LinesComponent<Datum> = LinesComponent<Datum>,
> extends HoverDirective {
  @Input('vicLinesHoverActions')
  actions: EventAction<LinesHoverDirective<Datum>>[];

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

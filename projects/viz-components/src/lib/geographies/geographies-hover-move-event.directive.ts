import { Directive, Input } from '@angular/core';
import { HoverAndMoveEventDirective } from '../events/hover-move-event';

@Directive({
  selector: '[vicLinesHoverAndMoveEffects]',
})
export class LinesHoverAndMoveEventDirective extends HoverAndMoveEventDirective {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('vicLinesHoverAndMoveEffects') effects: LinesHoverAndMoveEffect[];
  @Input() pointerDetectionRadius: number | null = 80;
  @Output() hoverAndMoveEventOutput = new EventEmitter<LinesEmittedOutput>();
  pointerX: number;
  pointerY: number;
  closestPointIndex: number;

  constructor(@Inject(GEOGRAPHIES) public geographies: GeographiesComponent) {
    super(lines);
  }
}

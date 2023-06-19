import {
  Directive,
  EventEmitter,
  Inject,
  Input,
  Optional,
  Output,
  Self,
} from '@angular/core';
import { Observable } from 'rxjs';
import { ClickEventDirective } from '../events/click-event';
import { EventEffect } from '../events/effect';
import { ListenElement } from '../events/event';
import { LinesHoverEventDirective } from './lines-hover-event.directive';
import { LinesHoverAndMoveEventDirective } from './lines-hover-move-event.directive';
import {
  getLinesTooltipDataFromDatum,
  LinesEmittedOutput,
} from './lines-tooltip-data';
import { LINES, LinesComponent } from './lines.component';

@Directive({
  selector: '[vicLinesMarkerClickEffects]',
})
export class LinesMarkerClickEventDirective extends ClickEventDirective {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('vicLinesMarkerClickEffects')
  effects: EventEffect<LinesMarkerClickEventDirective>[];
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('vicLinesMarkerClickRemoveEvent$')
  override clickRemoveEvent$: Observable<void>;
  // eslint-disable-next-line @angular-eslint/no-output-rename
  @Output('vicLinesMarkerClickOutput') eventOutput =
    new EventEmitter<LinesEmittedOutput>();
  pointIndex: number;

  constructor(
    @Inject(LINES) public lines: LinesComponent,
    @Self()
    @Optional()
    public hoverAndMoveDirective?: LinesHoverAndMoveEventDirective,
    @Self()
    @Optional()
    public hoverDirective?: LinesHoverEventDirective
  ) {
    super();
  }

  setListenedElements(): void {
    this.elements = Array.from(
      this.lines.chart.svgRef.nativeElement.querySelectorAll(
        `.${this.lines.markerClass}`
      )
    );
    this.setListeners();
  }

  onElementClick(event: PointerEvent, el: ListenElement): void {
    this.el = el;
    this.pointIndex = +el.getAttribute(this.lines.markerIndexAttr);
    this.effects.forEach((effect) => effect.applyEffect(this));
  }

  onClickRemove(): void {
    this.effects.forEach((effect) => effect.removeEffect(this));
  }

  getTooltipData(): LinesEmittedOutput {
    const data = getLinesTooltipDataFromDatum(this.pointIndex, this.lines);
    return data;
  }

  preventOtherEffects(): void {
    const otherEventDirectives = [
      this.hoverAndMoveDirective,
      this.hoverDirective,
    ];
    otherEventDirectives.forEach((directive) => {
      if (directive) {
        directive.preventEffect = true;
      }
    });
  }

  restartOtherEffects(): void {
    const otherEventDirectives = [
      this.hoverAndMoveDirective,
      this.hoverDirective,
    ];
    otherEventDirectives.forEach((directive) => {
      if (directive) {
        directive.preventEffect = false;
        directive.effects.forEach((effect) => effect.removeEffect(directive));
      }
    });
  }
}

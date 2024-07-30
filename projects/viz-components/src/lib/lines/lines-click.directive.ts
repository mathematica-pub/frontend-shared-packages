/* eslint-disable @angular-eslint/no-output-rename */
/* eslint-disable @angular-eslint/no-input-rename */
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
import { ClickDirective } from '../events/click.directive';
import { EventEffect } from '../events/effect';
import { LinesEventDirective } from './lines-event-directive';
import { LinesHoverMoveDirective } from './lines-hover-move.directive';
import { LinesHoverDirective } from './lines-hover.directive';
import { LinesInputEventDirective } from './lines-input-event.directive';
import {
  VicLinesEventOutput,
  getLinesTooltipDataFromDatum,
} from './lines-tooltip-data';
import { LINES, LinesComponent } from './lines.component';

@Directive({
  selector: '[vicLinesChartClickEffects]',
})
export class LinesClickDirective<
  Datum,
  ExtendedLinesComponent extends LinesComponent<Datum> = LinesComponent<Datum>,
> extends ClickDirective {
  @Input('vicLinesChartClickEffects')
  effects: EventEffect<LinesClickDirective<Datum, ExtendedLinesComponent>>[];
  @Input('vicLinesChartClickRemoveEvent$')
  override clickRemoveEvent$: Observable<void>;
  @Output('vicLinesChartClickOutput') eventOutput = new EventEmitter<
    VicLinesEventOutput<Datum>
  >();

  constructor(
    @Inject(LINES) public lines: ExtendedLinesComponent,
    @Self()
    @Optional()
    public hoverDirective?: LinesHoverDirective<Datum, ExtendedLinesComponent>,
    @Self()
    @Optional()
    public hoverAndMoveDirective?: LinesHoverMoveDirective<
      Datum,
      ExtendedLinesComponent
    >,
    @Self()
    @Optional()
    public inputEventDirective?: LinesInputEventDirective<
      Datum,
      ExtendedLinesComponent
    >
  ) {
    super();
  }

  setListenedElements(): void {
    this.elements = [this.lines.chart.svgRef.nativeElement];
    this.setListeners();
  }

  onElementClick(): void {
    this.effects.forEach((effect) => effect.applyEffect(this));
  }

  onClickRemove(): void {
    this.effects.forEach((effect) => effect.removeEffect(this));
  }

  getOutputData(): VicLinesEventOutput<Datum> {
    if (!this.hoverAndMoveDirective) {
      console.warn(
        'Tooltip data can only be retrieved when a LinesHoverMoveDirective is implemented.'
      );
    }
    if (this.hoverAndMoveDirective.closestPointIndex) {
      const data = getLinesTooltipDataFromDatum(
        this.hoverAndMoveDirective.closestPointIndex,
        this.lines
      );
      return data;
    } else {
      return null;
    }
  }

  preventHoverEffects(): void {
    const hoverEventDirectives = [
      this.hoverDirective,
      this.hoverAndMoveDirective,
    ];
    hoverEventDirectives.forEach((directive) => this.disableEffect(directive));
  }

  resumeHoverEffects(removeEffects = true): void {
    const hoverEventDirectives = [
      this.hoverDirective,
      this.hoverAndMoveDirective,
    ];
    hoverEventDirectives.forEach((directive) =>
      this.enableEffect(directive, removeEffects)
    );
  }

  preventInputEventEffects(): void {
    this.disableEffect(this.inputEventDirective);
  }

  resumeInputEventEffects(removeEffects = true): void {
    this.enableEffect(this.inputEventDirective, removeEffects);
  }

  disableEffect(
    directive: LinesEventDirective<Datum, ExtendedLinesComponent>
  ): void {
    if (directive) {
      directive.preventEffect = true;
    }
  }

  enableEffect(
    directive: LinesEventDirective<Datum, ExtendedLinesComponent>,
    removeEffects: boolean
  ): void {
    if (directive) {
      directive.preventEffect = false;
      if (removeEffects) {
        directive.effects.forEach((effect) => effect.removeEffect(directive));
      }
    }
  }
}

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
import { EventAction } from '../../events/action';
import { ClickDirective } from '../../events/click.directive';
import { LINES, LinesComponent } from '../lines.component';
import { LinesEventDirective } from './lines-event-directive';
import { LinesEventOutput } from './lines-event-output';
import { LinesHoverMoveDirective } from './lines-hover-move.directive';
import { LinesHoverDirective } from './lines-hover.directive';
import { LinesInputEventDirective } from './lines-input-event.directive';

@Directive({
  selector: '[vicLinesChartClickActions]',
})
export class LinesClickDirective<
  Datum,
  ExtendedLinesComponent extends LinesComponent<Datum> = LinesComponent<Datum>,
> extends ClickDirective {
  @Input('vicLinesChartClickActions')
  actions: EventAction<LinesClickDirective<Datum, ExtendedLinesComponent>>[];
  @Input('vicLinesChartClickRemoveEvent$')
  override clickRemoveEvent$: Observable<void>;
  @Output('vicLinesChartClickOutput') eventOutput = new EventEmitter<
    LinesEventOutput<Datum>
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
    this.actions.forEach((action) => action.onStart(this));
  }

  onClickRemove(): void {
    this.actions.forEach((action) => action.onEnd(this));
  }

  getOutputData(): LinesEventOutput<Datum> {
    if (!this.hoverAndMoveDirective) {
      console.warn(
        'Tooltip data can only be retrieved when a LinesHoverMoveDirective is implemented.'
      );
    }
    if (this.hoverAndMoveDirective.closestPointIndex) {
      const data = this.lines.getTooltipData(
        this.hoverAndMoveDirective.closestPointIndex
      );
      return data;
    } else {
      return null;
    }
  }

  preventHoverActions(): void {
    const hoverEventDirectives = [
      this.hoverDirective,
      this.hoverAndMoveDirective,
    ];
    hoverEventDirectives.forEach((directive) => this.disableAction(directive));
  }

  resumeHoverActions(cancelCurrentActions = true): void {
    const hoverEventDirectives = [
      this.hoverDirective,
      this.hoverAndMoveDirective,
    ];
    hoverEventDirectives.forEach((directive) =>
      this.enableAction(directive, cancelCurrentActions)
    );
  }

  preventInputEventActions(): void {
    this.disableAction(this.inputEventDirective);
  }

  resumeInputEventActions(cancelCurrentActions = true): void {
    this.enableAction(this.inputEventDirective, cancelCurrentActions);
  }

  disableAction(
    directive: LinesEventDirective<Datum, ExtendedLinesComponent>
  ): void {
    if (directive) {
      directive.preventAction = true;
    }
  }

  enableAction(
    directive: LinesEventDirective<Datum, ExtendedLinesComponent>,
    cancelCurrentActions: boolean
  ): void {
    if (directive) {
      directive.preventAction = false;
      if (cancelCurrentActions) {
        directive.actions.forEach((action) => action.onEnd(directive));
      }
    }
  }
}

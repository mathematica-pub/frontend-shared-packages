import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { ChartComponent } from '../chart/chart.component';
import { InputEvent } from '../events/input-event';
import { XyChartComponent } from '../xy-chart/xy-chart.component';
import { LinesEffect } from './lines-effect';
import { LinesComponent } from './lines.component';
import { LinesEmittedData } from './lines.model';

@Directive({
  selector: '[vzc-data-marks-lines][vzcLinesInputEffects]',
  providers: [
    {
      provide: ChartComponent,
      useExisting: XyChartComponent,
    },
  ],
})
export class LinesInputEvent extends InputEvent {
  @Input('vzcLinesInputEffects') effects: ReadonlyArray<LinesEffect>;
  @Output('hoverAndMoveData') emittedData =
    new EventEmitter<LinesEmittedData>();

  constructor(public lines: LinesComponent) {
    super();
  }

  handleNewEvent(event: any): void {
    if (event) {
      this.effects.forEach((effect) =>
        effect.applyEffect(this.lines, event, this.emittedData)
      );
    } else {
      this.effects.forEach((effect) =>
        effect.removeEffect(this.lines, event, this.emittedData)
      );
    }
  }
}

import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { ChartComponent } from '../chart/chart.component';
import { InputEvent } from '../events/input-event';
import { XyChartComponent } from '../xy-chart/xy-chart.component';
import { LinesInputEffect } from './lines-effect';
import { LinesComponent } from './lines.component';

@Directive({
  selector: '[vic-data-marks-lines][vicLinesInputEffects]',
  providers: [
    {
      provide: ChartComponent,
      useExisting: XyChartComponent,
    },
  ],
})
export class LinesInputEvent extends InputEvent {
  @Input('vicLinesInputEffects') effects: ReadonlyArray<LinesInputEffect>;
  @Output('inputData') emittedData = new EventEmitter<any>();

  constructor(public lines: LinesComponent) {
    super();
  }

  handleNewEvent(inputEvent: any): void {
    if (inputEvent) {
      this.effects.forEach((effect) => effect.applyEffect(this, inputEvent));
    } else {
      this.effects.forEach((effect) => effect.removeEffect(this, inputEvent));
    }
  }
}

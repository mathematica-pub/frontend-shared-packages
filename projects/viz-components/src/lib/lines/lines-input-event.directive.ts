import { Directive, EventEmitter, inject, Input, Output } from '@angular/core';
import { ChartComponent } from '../chart/chart.component';
import { InputEventDirective } from '../events/input-event';
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
export class LinesInputEventDirective extends InputEventDirective {
  @Input() vicLinesInputEffects: LinesInputEffect[];
  @Output() inputEventOutput = new EventEmitter<any>();
  public lines = inject(LinesComponent);

  handleNewEvent(inputEvent: any): void {
    if (inputEvent) {
      this.vicLinesInputEffects.forEach((effect) =>
        effect.applyEffect(this, inputEvent)
      );
    } else {
      this.vicLinesInputEffects.forEach((effect) =>
        effect.removeEffect(this, inputEvent)
      );
    }
  }
}

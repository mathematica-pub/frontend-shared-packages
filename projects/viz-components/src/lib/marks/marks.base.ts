import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { isEqual } from 'lodash-es';
import { Chart } from '../chart/chart';
import { Ranges } from '../chart/chart.component';
import { VicIMarks } from '../data-marks/data-marks-base';
import { MarksOptions } from './config/marks-options';

@Directive()
export abstract class Marks<Datum, TMarksConfig extends MarksOptions<Datum>>
  implements VicIMarks, OnChanges
{
  @Input() config: TMarksConfig;
  abstract drawMarks(): void;
  abstract getTransitionDuration(): number;
  chart: Chart;
  ranges: Ranges;

  ngOnChanges(changes: SimpleChanges): void {
    const config = changes['config'];
    if (
      config &&
      !config.isFirstChange() &&
      !isEqual(config.currentValue, config.previousValue)
    ) {
      this.initFromConfig();
    }
  }

  initFromConfig(): void {
    this.drawMarks();
  }
}

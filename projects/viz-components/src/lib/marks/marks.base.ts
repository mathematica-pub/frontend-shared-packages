import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart } from '../chart/chart';
import { Ranges } from '../chart/chart.component';
import { NgOnChangesUtilities } from '../core/utilities/ng-on-changes';
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
    if (
      NgOnChangesUtilities.inputObjectChangedNotFirstTime(changes, 'config')
    ) {
      this.initFromConfig();
    }
  }

  initFromConfig(): void {
    this.drawMarks();
  }
}

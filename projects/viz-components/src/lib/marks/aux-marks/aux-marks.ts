import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart } from '../../chart/chart';
import { NgOnChangesUtilities } from '../../core/utilities/ng-on-changes';
import { MarksOptions } from '../config/marks-options';
import { Marks } from '../marks';

@Directive()
export abstract class AuxMarks<Datum, TMarksConfig extends MarksOptions<Datum>>
  implements Marks, OnChanges
{
  @Input() config: TMarksConfig;
  chart: Chart;

  abstract drawMarks(): void;
  abstract getTransitionDuration(): number;

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

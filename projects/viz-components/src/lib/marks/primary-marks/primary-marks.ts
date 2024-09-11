import {
  DestroyRef,
  Directive,
  InjectionToken,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { Chart, Ranges } from '../../chart';
import { NgOnChangesUtilities } from '../../core/utilities/ng-on-changes';
import { MarksOptions } from '../config/marks-options';
import { Marks } from '../marks';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const VIC_PRIMARY_MARKS = new InjectionToken<PrimaryMarks<unknown, any>>(
  'DataMarks'
);

@Directive()
export abstract class PrimaryMarks<
    Datum,
    TPrimaryMarksConfig extends MarksOptions<Datum>,
  >
  implements Marks, OnChanges
{
  @Input() config: TPrimaryMarksConfig;
  chart: Chart;
  ranges: Ranges;
  destroyRef = inject(DestroyRef);

  abstract drawMarks(): void;
  abstract getTransitionDuration(): number;
  /**
   * This method sets creates and sets scales on ChartComponent. Any methods that require ranges
   * to create the scales should be called from this method. Methods called from here should not
   * require scales.
   *
   * This method is called on init, after config-based properties are set, and also on
   * resize/when ranges change.
   */
  abstract setChartScalesFromRanges(useTransition: boolean): void;

  ngOnChanges(changes: SimpleChanges): void {
    if (
      NgOnChangesUtilities.inputObjectChangedNotFirstTime(changes, 'config')
    ) {
      this.initFromConfig();
    }
  }

  initFromConfig(): void {
    this.setChartScalesFromRanges(true);
  }
}

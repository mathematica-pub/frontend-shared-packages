import {
  DestroyRef,
  Directive,
  InjectionToken,
  Input,
  OnChanges,
  inject,
} from '@angular/core';
import { Ranges } from '../../charts';
import { MarksOptions } from '../config/marks-options';
import { Marks } from '../marks';

export const VIC_PRIMARY_MARKS = new InjectionToken<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  VicPrimaryMarks<unknown, any>
>('VicPrimaryMarks');

@Directive()
export abstract class VicPrimaryMarks<
    Datum,
    TPrimaryMarksConfig extends MarksOptions<Datum>,
  >
  extends Marks
  implements Marks, OnChanges
{
  @Input() config: TPrimaryMarksConfig;
  ranges: Ranges;
  destroyRef = inject(DestroyRef);

  /**
   * This method sets creates and sets scales on ChartComponent. Any methods that require ranges
   * to create the scales should be called from this method. Methods called from here should not
   * require scales.
   *
   * This method is called on init, after config-based properties are set, and also on
   * resize/when ranges change.
   */
  abstract setChartScalesFromRanges(useTransition: boolean): void;

  initFromConfig(): void {
    this.setChartScalesFromRanges(true);
  }
}

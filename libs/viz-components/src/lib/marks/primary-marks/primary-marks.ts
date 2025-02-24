import {
  DestroyRef,
  Directive,
  InjectionToken,
  Input,
  OnChanges,
  inject,
} from '@angular/core';
import { Ranges } from '../../charts';
import { DataValue } from '../../core/types/values';
import { DataMarksConfig, MarksConfig } from '../config/marks-config';
import { Marks } from '../marks';

export const VIC_PRIMARY_MARKS = new InjectionToken<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PrimaryMarks<unknown, DataValue, any>
>('PrimaryMarks');

@Directive()
export abstract class PrimaryMarks<
    Datum,
    ChartMultipleDomain extends DataValue,
    TPrimaryMarksConfig extends
      | MarksConfig
      | DataMarksConfig<Datum, ChartMultipleDomain>,
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

import {
  DestroyRef,
  Directive,
  InjectionToken,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { Chart } from '../chart/chart';
import { Ranges } from '../chart/chart.component';
import { NgOnChangesUtilities } from '../core/utilities/ng-on-changes';
import { IMarks } from '../marks/marks.base';
import { DataMarksOptions } from './config/data-marks-options';

export interface IData {
  ranges: Ranges;
  /**
   * setPropertiesFromRanges method
   *
   * This method sets creates and sets scales on ChartComponent. Any methods that require ranges
   * to create the scales should be called from this method. Methods called from here should not
   * require scales.
   *
   * This method is called on init, after config-based properties are set, and also on
   * resize/when ranges change.
   */
  setChartScalesFromRanges: (useTransition: boolean) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const VIC_DATA_MARKS = new InjectionToken<DataMarks<unknown, any>>(
  'DataMarks'
);

@Directive()
export abstract class DataMarks<
    Datum,
    TDataMarksConfig extends DataMarksOptions<Datum>,
  >
  implements IData, IMarks, OnChanges
{
  @Input() config: TDataMarksConfig;
  chart: Chart;
  ranges: Ranges;
  destroyRef = inject(DestroyRef);

  abstract drawMarks(): void;
  abstract getTransitionDuration(): number;
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

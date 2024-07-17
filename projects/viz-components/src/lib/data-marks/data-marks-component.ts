import {
  DestroyRef,
  Directive,
  InjectionToken,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { isEqual } from 'lodash-es';
import { Chart } from '../chart/chart';
import { Ranges } from '../chart/chart.component';
import { VicDataMarksOptions } from './config/data-marks-options';

export interface VicICommon {
  chart: Chart;
  ranges: Ranges;
}

export interface VicIData extends VicICommon {
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
  setPropertiesFromRanges: (useTransition: boolean) => void;
}

export interface VicIMarks extends VicICommon {
  /**
   * drawMarks method
   *
   * All methods that require scales should be called from drawMarks. Methods
   * called from here should use scale.domain() or scale.range() to obtain those values
   * rather than this.config.dimension.domain or this.ranges.dimension.
   *
   * This method is called when scales emit from ChartComponent.
   */
  drawMarks: () => void;
  /**
   * getTransitionDuration method
   *
   * This method should return the duration of the transition to be used in the marks.
   */
  getTransitionDuration: () => number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const VIC_DATA_MARKS = new InjectionToken<VicDataMarks<unknown, any>>(
  'DataMarks'
);

@Directive()
export abstract class VicDataMarks<
  Datum,
  TDataMarksConfig extends VicDataMarksOptions<Datum>
> implements VicIData, VicIMarks, OnChanges
{
  @Input() config: TDataMarksConfig;
  chart: Chart;
  destroyRef = inject(DestroyRef);
  ranges: Ranges;

  abstract drawMarks(): void;
  abstract getTransitionDuration(): number;
  abstract setPropertiesFromRanges(useTransition: boolean): void;

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
    this.setPropertiesFromRanges(true);
  }
}

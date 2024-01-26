import {
  DestroyRef,
  Directive,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { isEqual } from 'lodash-es';
import { Chart } from '../chart/chart';
import { Ranges } from '../chart/chart.component';
import { isDate } from '../core/utilities/isDate';
import { DataMarks } from './data-marks';
import { VicDataMarksConfig } from './data-marks.config';

@Directive()
export abstract class DataMarksBase<T, U extends VicDataMarksConfig<T>>
  implements DataMarks, OnChanges
{
  chart: Chart;
  ranges: Ranges;
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('config') userConfig: U;
  config: U;
  destroyRef = inject(DestroyRef);

  /**
   * setPropertiesFromConfig method
   *
   * This method handles an update to the config object. Methods called from here should not
   * requires ranges or scales. This method is called on init and on config update.
   */
  abstract setPropertiesFromConfig(): void;
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
  abstract setPropertiesFromRanges(useTransition: boolean): void;
  abstract setValueArrays(): void;
  /**
   * drawMarks method
   *
   * All methods that require scales should be called from drawMarks. Methods
   * called from here should use scale.domain() or scale.range() to obtain those values
   * rather than this.config.dimension.domain or this.ranges.dimension.
   *
   * This method is called when scales emit from ChartComponent.
   */
  abstract drawMarks(): void;
  /**
   * resizeMarks method
   *
   * All methods that should be called when the chart resizes due to browser layout should
   * be called from resizeMarks. Generally, the required method will update the scales, which
   * will in turn call drawMarks, but now always.
   *
   * This method is called when ranges emit from ChartComponent.
   */
  abstract resizeMarks(): void;

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['userConfig'] &&
      !changes['userConfig'].isFirstChange() &&
      !isEqual(
        changes['userConfig'].currentValue,
        changes['userConfig'].previousValue
      )
    ) {
      this.initFromConfig();
    }
  }

  initFromConfig(): void {
    this.setConfig();
    this.setPropertiesFromConfig();
    this.setPropertiesFromRanges(true);
  }

  setConfig(): void {
    this.config = this.deepCloneObject(
      this.userConfig as Record<string, unknown>
    ) as U;
  }

  deepCloneObject(object: Record<string, unknown>): Record<string, unknown> {
    const newObj = {} as Record<string, unknown>;
    Object.entries(object).forEach(([key, value]) => {
      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value) &&
        !isDate(value)
      ) {
        newObj[key] = this.deepCloneObject(value as Record<string, unknown>);
      } else if (typeof value === 'function') {
        this.assignValue(newObj, key, value);
      } else {
        this.structuredCloneValue(newObj, key, value);
      }
    });
    return newObj;
  }

  assignValue(
    newObj: Record<string, unknown>,
    key: string,
    value: unknown
  ): void {
    newObj[key] = value;
  }

  structuredCloneValue(
    newObj: Record<string, unknown>,
    key: string,
    value: unknown
  ): void {
    newObj[key] = structuredClone(value);
  }
}

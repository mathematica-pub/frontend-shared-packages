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

  abstract setPropertiesFromConfig(): void;
  abstract setPropertiesFromRanges(useTransition: boolean): void;
  abstract setValueArrays(): void;
  abstract drawMarks(): void;
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

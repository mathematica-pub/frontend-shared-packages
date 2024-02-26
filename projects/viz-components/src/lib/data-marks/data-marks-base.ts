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
      if (this.isDeepCloneableObject(value)) {
        newObj[key] = this.deepCloneObject(value as Record<string, unknown>);
      } else if (Array.isArray(value)) {
        newObj[key] = value.map((v) => this.deepCloneArrayValue(v));
      } else if (typeof value === 'function') {
        this.assignValue(newObj, key, value);
      } else {
        this.structuredCloneObjectValue(newObj, key, value);
      }
    });
    return newObj;
  }

  isDeepCloneableObject(value: unknown): boolean {
    return (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      !isDate(value)
    );
  }

  deepCloneArrayValue(value: unknown): unknown {
    if (this.isDeepCloneableObject(value)) {
      return this.deepCloneObject(value as Record<string, unknown>);
    } else if (Array.isArray(value)) {
      return value.map((v) => this.deepCloneArrayValue(v));
    } else {
      return structuredClone(value);
    }
  }

  assignValue(
    newObj: Record<string, unknown>,
    key: string,
    value: unknown
  ): void {
    newObj[key] = value;
  }

  structuredCloneObjectValue(
    newObj: Record<string, unknown>,
    key: string,
    value: unknown
  ): void {
    newObj[key] = structuredClone(value);
  }
}

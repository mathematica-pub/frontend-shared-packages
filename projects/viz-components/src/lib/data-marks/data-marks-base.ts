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
import { DataMarks } from './data-marks';
import { VicDataMarksConfig } from './data-marks.config';

@Directive()
export abstract class DataMarksBase<
  Datum,
  TDataMarksConfig extends VicDataMarksConfig<Datum>
> implements DataMarks, OnChanges
{
  chart: Chart;
  ranges: Ranges;
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('config') config: TDataMarksConfig;
  destroyRef = inject(DestroyRef);

  abstract setPropertiesFromConfig(): void;
  abstract setPropertiesFromRanges(useTransition: boolean): void;
  abstract setValueArrays(): void;
  abstract drawMarks(): void;
  abstract resizeMarks(): void;

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['config'] &&
      !changes['config'].isFirstChange() &&
      !isEqual(changes['config'].currentValue, changes['config'].previousValue)
    ) {
      this.initFromConfig();
    }
  }

  initFromConfig(): void {
    this.setPropertiesFromConfig();
    this.setPropertiesFromRanges(true);
  }
}

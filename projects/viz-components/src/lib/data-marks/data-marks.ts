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
import { VicDataMarksOptions, VicIData, VicIMarks } from './data-marks-types';

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

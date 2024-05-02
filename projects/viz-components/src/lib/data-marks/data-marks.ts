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
import { VicDataMarksConfig, VicIData, VicIMarks } from './data-marks-types';

@Directive()
export abstract class VicDataMarks<
  Datum,
  TDataMarksConfig extends VicDataMarksConfig<Datum>
> implements VicIData, VicIMarks, OnChanges
{
  @Input() config: TDataMarksConfig;
  chart: Chart;
  ranges: Ranges;
  destroyRef = inject(DestroyRef);

  abstract setPropertiesFromData(): void;
  abstract setPropertiesFromRanges(useTransition: boolean): void;
  abstract drawMarks(): void;
  abstract resizeMarks(): void;
  abstract getTransitionDuration(): number;

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
    this.setPropertiesFromData();
    this.setPropertiesFromRanges(true);
  }
}

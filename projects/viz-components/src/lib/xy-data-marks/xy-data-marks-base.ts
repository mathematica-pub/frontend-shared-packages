import { Directive, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { UtilitiesService } from '../core/services/utilities.service';
import { DataMarksBase } from '../data-marks/data-marks-base';
import { VicDataMarksConfig } from '../data-marks/data-marks.config';
import {
  XyChartComponent,
  XyChartScales,
  XyContentScale,
} from '../xy-chart/xy-chart.component';
import { XyDataMarksValues } from './xy-data-marks';

/**
 * @internal
 */
@Directive()
export abstract class XyDataMarksBase<T, U extends VicDataMarksConfig<T>>
  extends DataMarksBase<T, U>
  implements OnInit
{
  scales: XyChartScales;
  requiredScales: (keyof typeof XyContentScale)[];
  values: XyDataMarksValues = new XyDataMarksValues();
  public override chart = inject(XyChartComponent);
  protected utilities = inject(UtilitiesService);

  ngOnInit(): void {
    this.setRequiredChartScales();
    this.subscribeToRanges();
    this.subscribeToScales();
    this.initFromConfig();
  }

  setRequiredChartScales(): void {
    this.requiredScales = [
      XyContentScale.x,
      XyContentScale.y,
      XyContentScale.category,
    ];
  }

  subscribeToRanges(): void {
    this.chart.ranges$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((ranges) => {
        this.ranges = ranges;
        if (
          this.scales &&
          this.requiredScales.every((scale) => this.scales[scale])
        ) {
          this.resizeMarks();
        }
      });
  }

  subscribeToScales(): void {
    this.chart.scales$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((scales) => !!scales)
      )
      .subscribe((scales): void => {
        this.scales = scales;
        this.drawMarks();
      });
  }

  resizeMarks(): void {
    this.setPropertiesFromRanges(false);
  }

  getTransitionDuration(): number {
    return this.scales.useTransition ? this.chart.transitionDuration : 0;
  }
}

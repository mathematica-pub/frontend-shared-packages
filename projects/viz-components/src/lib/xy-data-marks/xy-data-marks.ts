import { Directive, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { VicDataMarks } from '../data-marks/data-marks';
import { VicDataOptions } from '../data-marks/data-marks.config';
import {
  XyChartComponent,
  XyChartScales,
  XyContentScale,
} from '../xy-chart/xy-chart.component';

/**
 * @internal
 */
@Directive()
export abstract class VicXyDataMarks<
    Datum,
    TDataMarkConfig extends VicDataOptions<Datum>
  >
  extends VicDataMarks<Datum, TDataMarkConfig>
  implements OnInit
{
  scales: XyChartScales;
  requiredScales: (keyof typeof XyContentScale)[] = [
    XyContentScale.x,
    XyContentScale.y,
    XyContentScale.categorical,
  ];
  public override chart = inject(XyChartComponent);

  ngOnInit(): void {
    this.subscribeToRanges();
    this.subscribeToScales();
    this.initFromConfig();
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
          this.setPropertiesFromRanges(false);
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

  getTransitionDuration(): number {
    return this.scales.useTransition ? this.chart.transitionDuration : 0;
  }
}

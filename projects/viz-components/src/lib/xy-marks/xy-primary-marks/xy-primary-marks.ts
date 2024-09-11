import { Directive, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { MarksOptions } from '../../marks/config/marks-options';
import { PrimaryMarks } from '../../marks/primary-marks/primary-marks';
import {
  XyChartComponent,
  XyChartScales,
  XyContentScale,
} from '../../xy-chart/xy-chart.component';
import { XyMarks } from '../xy-marks';

/**
 * @internal
 */
@Directive()
export abstract class VicXyPrimaryMarks<
    Datum,
    TDataMarksConfig extends MarksOptions<Datum>,
  >
  extends PrimaryMarks<Datum, TDataMarksConfig>
  implements OnInit, XyMarks
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
          this.setChartScalesFromRanges(false);
        } else {
          this.initFromConfig();
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

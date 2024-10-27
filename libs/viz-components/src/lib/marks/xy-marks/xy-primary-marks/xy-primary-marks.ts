import { Directive, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import {
  XyChartComponent,
  XyChartScales,
  XyContentScale,
} from '../../../charts/xy-chart/xy-chart.component';
import { MarksOptions } from '../../config/marks-options';
import { VicPrimaryMarks } from '../../primary-marks/primary-marks';
import { XyMarks } from '../xy-marks';

/**
 * @internal
 */
@Directive()
export abstract class VicXyPrimaryMarks<
    Datum,
    TPrimaryMarksConfig extends MarksOptions<Datum>,
  >
  extends VicPrimaryMarks<Datum, TPrimaryMarksConfig>
  implements OnInit, XyMarks
{
  scales: XyChartScales;
  requiredScales: (keyof typeof XyContentScale)[] = [
    XyContentScale.x,
    XyContentScale.y,
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
        this.scales.x = scales.x;
        this.scales.y = scales.y;
        this.scales.useTransition = scales.useTransition;
        this.drawMarks();
      });
  }

  getTransitionDuration(): number {
    return this.scales.useTransition ? this.chart.transitionDuration : 0;
  }
}

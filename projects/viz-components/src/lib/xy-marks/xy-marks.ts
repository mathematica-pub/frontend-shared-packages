import { DestroyRef, Directive, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { MarksOptions } from '../marks/config/marks-options';
import { Marks } from '../marks/marks.base';
import {
  XyChartComponent,
  XyChartScales,
} from '../xy-chart/xy-chart.component';

export interface XyMarks {
  chart: XyChartComponent;
  scales: XyChartScales;
  subscribeToScales: () => void;
}

@Directive()
export abstract class VicXyMarks<
    Datum,
    TMarksConfig extends MarksOptions<Datum>,
  >
  extends Marks<Datum, TMarksConfig>
  implements OnInit, XyMarks
{
  scales: XyChartScales;
  public override chart = inject(XyChartComponent);

  constructor(private destroyRef: DestroyRef) {
    super();
  }

  ngOnInit(): void {
    this.subscribeToScales();
  }

  subscribeToScales(): void {
    this.chart.scales$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((scales) => !!scales.x && !!scales.y)
      )
      .subscribe((scales): void => {
        this.scales = scales;
        // console.log(this.scales.x.range(), this.scales.y.range());
        // console.log(this.scales.x.domain(), this.scales.y.domain());
        this.drawMarks();
      });
  }

  getTransitionDuration(): number {
    return this.scales.useTransition ? this.chart.transitionDuration : 0;
  }
}

import { DestroyRef, Directive, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { AuxMarks } from '../../marks/aux-marks/aux-marks';
import { MarksOptions } from '../../marks/config/marks-options';
import { XyChartComponent, XyChartScales } from '../../xy-chart';
import { XyMarks } from '../xy-marks';

@Directive()
export abstract class XyAuxMarks<
    Datum,
    TMarksConfig extends MarksOptions<Datum>,
  >
  extends AuxMarks<Datum, TMarksConfig>
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
        this.drawMarks();
      });
  }

  getTransitionDuration(): number {
    return this.scales.useTransition ? this.chart.transitionDuration : 0;
  }
}

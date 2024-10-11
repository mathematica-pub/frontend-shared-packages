import { DestroyRef, Directive, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { XyChartComponent, XyChartScales } from '../../../charts';
import { VicAuxMarks } from '../../aux-marks/aux-marks';
import { MarksOptions } from '../../config/marks-options';
import { XyMarks } from '../xy-marks';

@Directive()
export abstract class XyAuxMarks<
    Datum,
    TMarksConfig extends MarksOptions<Datum>,
  >
  extends VicAuxMarks<Datum, TMarksConfig>
  implements OnInit, XyMarks
{
  scales: XyChartScales;
  public override chart = inject(XyChartComponent);
  private destroyRef = inject(DestroyRef);

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

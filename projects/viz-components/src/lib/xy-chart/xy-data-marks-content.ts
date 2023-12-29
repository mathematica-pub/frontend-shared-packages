import { Directive, OnInit, inject } from '@angular/core';
import { combineLatest, filter, takeUntil } from 'rxjs';
import { Ranges } from '../chart/chart.component';
import { Unsubscribe } from '../shared/unsubscribe.class';
import {
  XyChartComponent,
  XyChartScales,
  XyContentScale,
} from './xy-chart.component';

/**
 * @internal
 */
@Directive()
export abstract class XyDataMarksContent extends Unsubscribe implements OnInit {
  ranges: Ranges;
  scales: XyChartScales;
  requiredScales: (keyof typeof XyContentScale)[];
  public chart = inject(XyChartComponent);

  abstract setPropertiesFromConfig(): void;
  abstract setChartScales(useTransition: boolean): void;
  abstract drawMarks(): void;

  ngOnInit(): void {
    this.setRequiredChartScales();
    this.subscribeToRanges();
    this.subscribeToScales();
    this.setPropertiesFromConfig();
  }

  setRequiredChartScales(): void {
    this.requiredScales = [
      XyContentScale.x,
      XyContentScale.y,
      XyContentScale.category,
    ];
  }

  subscribeToRanges(): void {
    this.chart.ranges$.pipe(takeUntil(this.unsubscribe)).subscribe((ranges) => {
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
        takeUntil(this.unsubscribe),
        filter((scales) => !!scales)
      )
      .subscribe((scales): void => {
        this.scales = scales;
        this.drawMarks();
      });
  }

  resizeMarks(): void {
    this.setChartScales(false);
  }

  getTransitionDuration(): number {
    return this.scales.useTransition ? this.chart.transitionDuration : 0;
  }
}

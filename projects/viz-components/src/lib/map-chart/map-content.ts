import { Directive, OnInit } from '@angular/core';
import { combineLatest, takeUntil } from 'rxjs';
import { VicAttributeDataDimensionConfig } from '../geographies/geographies.config';
import { Unsubscribe } from '../shared/unsubscribe.class';
import { MapChartComponent } from './map-chart.component';
import { Ranges } from '../chart/chart.component';

/**
 * @internal
 */
@Directive()
export abstract class MapContent extends Unsubscribe {
  ranges: Ranges;
  attributeDataScale: any;
  attributeDataConfig: VicAttributeDataDimensionConfig;

  constructor(public chart: MapChartComponent) {
    super();
  }

  abstract drawMarks(): void;
  abstract resizeMarks(): void;

  subscribeToRanges(): void {
    this.chart.ranges$.pipe(takeUntil(this.unsubscribe)).subscribe((ranges) => {
      this.ranges = ranges;
      if (this.attributeDataScale && this.attributeDataConfig) {
        this.resizeMarks();
      }
    });
  }

  subscribeToAttributeScaleAndConfig(): void {
    const subscriptions = [
      this.chart.attributeDataScale$,
      this.chart.attributeDataConfig$,
    ];

    combineLatest(subscriptions)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(([scale, config]) => {
        this.attributeDataConfig = config;
        this.attributeDataScale = scale;
        this.drawMarks();
      });
  }
}

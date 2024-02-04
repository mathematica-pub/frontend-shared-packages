import {
  Directive,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { combineLatest, filter, takeUntil } from 'rxjs';
import { Ranges } from '../chart/chart.component';
import { NgOnChangesUtilities } from '../core/utilities/ng-on-changes';
import { VicAttributeDataDimensionConfig } from '../geographies/geographies.config';
import { Unsubscribe } from '../shared/unsubscribe.class';
import { MapChartComponent } from './map-chart.component';

/**
 * @internal
 */
@Directive()
export abstract class MapDataMarksBase
  extends Unsubscribe
  implements OnChanges, OnInit
{
  ranges: Ranges;
  attributeDataScale: any;
  attributeDataConfig: VicAttributeDataDimensionConfig;
  public chart = inject(MapChartComponent);

  abstract drawMarks(): void;
  abstract resizeMarks(): void;
  abstract initFromConfig(): void;

  ngOnChanges(changes: SimpleChanges): void {
    if (
      NgOnChangesUtilities.inputObjectChangedNotFirstTime(changes, 'config')
    ) {
      this.initFromConfig();
    }
  }

  ngOnInit(): void {
    this.subscribeToRanges();
    this.subscribeToAttributeScaleAndConfig();
    this.initFromConfig();
  }

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
      .pipe(
        takeUntil(this.unsubscribe),
        filter(([scale, config]) => !!scale && !!config)
      )
      .subscribe(([scale, config]) => {
        this.attributeDataConfig = config;
        this.attributeDataScale = scale;
        this.drawMarks();
      });
  }
}

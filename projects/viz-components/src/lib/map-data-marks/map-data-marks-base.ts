import { Directive, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest, filter } from 'rxjs';
import { UtilitiesService } from '../core/services/utilities.service';
import { DataMarksBase } from '../data-marks/data-marks-base';
import { VicDataMarksConfig } from '../data-marks/data-marks.config';
import { VicAttributeDataDimensionConfig } from '../geographies/geographies.config';
import { MapChartComponent } from '../map-chart/map-chart.component';

/**
 * @internal
 */
@Directive()
export abstract class MapDataMarksBase<T, U extends VicDataMarksConfig<T>>
  extends DataMarksBase<T, U>
  implements OnInit
{
  attributeDataScale: any;
  attributeDataConfig: VicAttributeDataDimensionConfig<T>;
  public override chart = inject(MapChartComponent);
  protected utilities = inject(UtilitiesService);

  ngOnInit(): void {
    this.subscribeToRanges();
    this.subscribeToAttributeScaleAndConfig();
    this.initFromConfig();
  }

  subscribeToRanges(): void {
    this.chart.ranges$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((ranges) => {
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
        takeUntilDestroyed(this.destroyRef),
        filter(([scale, config]) => !!scale && !!config)
      )
      .subscribe(([scale, config]) => {
        this.attributeDataConfig = config;
        this.attributeDataScale = scale;
        this.drawMarks();
      });
  }
}

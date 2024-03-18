import { Directive, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest, filter } from 'rxjs';
import { DataMarksBase } from '../data-marks/data-marks-base';
import { VicDataMarksConfig } from '../data-marks/data-marks.config';
import { VicAttributeDataDimensionConfig } from '../geographies/geographies.config';
import { MapChartComponent } from '../map-chart/map-chart.component';

/**
 * @internal
 */
@Directive()
export abstract class MapDataMarksBase<
    Datum,
    ExtendedDataMarksConfig extends VicDataMarksConfig<Datum>
  >
  extends DataMarksBase<Datum, ExtendedDataMarksConfig>
  implements OnInit
{
  attributeDataScale: any;
  attributeDataConfig: VicAttributeDataDimensionConfig<Datum>;
  public override chart = inject(MapChartComponent);

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

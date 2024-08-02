import { Directive, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
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
    ExtendedDataMarksConfig extends VicDataMarksConfig<Datum>,
  >
  extends DataMarksBase<Datum, ExtendedDataMarksConfig>
  implements OnInit
{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributeDataScale: any;
  attributeDataConfig: VicAttributeDataDimensionConfig<Datum>;
  public override chart = inject(MapChartComponent);

  ngOnInit(): void {
    this.subscribeToRanges();
    this.subscribeToAttributeProperties();
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

  subscribeToAttributeProperties(): void {
    this.chart.attributeProperties$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((properties) => !!properties.scale && !!properties.config)
      )
      .subscribe((properties) => {
        this.attributeDataConfig = properties.config;
        this.attributeDataScale = properties.scale;
        this.drawMarks();
      });
  }
}

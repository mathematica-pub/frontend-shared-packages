import { Directive, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { VicDataMarks } from '../data-marks/data-marks';
import { VicDataMarksConfig } from '../data-marks/data-marks-types';
import { VicAttributeDataDimensionConfig } from '../geographies/dimensions/attribute-data-bin-types';
import { MapChartComponent } from '../map-chart/map-chart.component';

/**
 * @internal
 */
@Directive()
export abstract class VicMapDataMarks<
    Datum,
    ExtendedDataMarksConfig extends VicDataMarksConfig<Datum>
  >
  extends VicDataMarks<Datum, ExtendedDataMarksConfig>
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
          this.setPropertiesFromRanges(false);
          this.drawMarks();
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

  getTransitionDuration(): number {
    return this.chart.transitionDuration;
  }
}

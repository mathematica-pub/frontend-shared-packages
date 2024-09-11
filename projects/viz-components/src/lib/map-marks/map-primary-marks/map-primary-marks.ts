import { Directive, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { VicAttributeDataDimensionConfig } from '../../geographies/config/layers/attribute-data-layer/dimensions/attribute-data-bin-types';
import { MapChartComponent } from '../../map-chart/map-chart.component';
import { MarksOptions } from '../../marks/config/marks-options';
import { PrimaryMarks } from '../../marks/primary-marks/primary-marks';

/**
 * @internal
 */
@Directive()
export abstract class MapPrimaryMarks<
    Datum,
    TPrimaryMarksConfig extends MarksOptions<Datum>,
  >
  extends PrimaryMarks<Datum, TPrimaryMarksConfig>
  implements OnInit
{
  attributeDataConfig: VicAttributeDataDimensionConfig<Datum>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributeDataScale: any;
  public override chart = inject(MapChartComponent);

  ngOnInit(): void {
    this.subscribeToRanges();
    this.subscribeToAttributeDataProperties();
    this.initFromConfig();
  }

  subscribeToRanges(): void {
    this.chart.ranges$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((ranges) => {
        this.ranges = ranges;
        if (this.attributeDataScale && this.attributeDataConfig) {
          this.setChartScalesFromRanges(false);
          this.drawMarks();
        }
      });
  }

  subscribeToAttributeDataProperties(): void {
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

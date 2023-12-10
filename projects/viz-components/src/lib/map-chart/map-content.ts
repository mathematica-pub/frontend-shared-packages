import { Directive } from '@angular/core';
import { combineLatest, takeUntil } from 'rxjs';
import { VicAttributeDataDimensionConfig } from '../geographies/geographies.config';
import { Unsubscribe } from '../shared/unsubscribe.class';
import { MapChartComponent } from './map-chart.component';

/**
 * @internal
 */
@Directive()
export abstract class MapContent extends Unsubscribe {
  attributeDataScale: any;
  attributeDataConfig: VicAttributeDataDimensionConfig;

  constructor(public chart: MapChartComponent) {
    super();
  }

  subscribeToScalesAndConfig(): void {
    const subscriptions = [
      this.chart.attributeDataScale$,
      this.chart.attributeDataConfig$,
    ];

    combineLatest(subscriptions)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(([scale, config]) => {
        this.setScaleAndConfig(scale, config);
      });
  }

  abstract setScaleAndConfig(
    scale: any,
    config: VicAttributeDataDimensionConfig
  ): void;
}

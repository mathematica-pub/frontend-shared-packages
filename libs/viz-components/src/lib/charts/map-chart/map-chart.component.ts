import { CommonModule } from '@angular/common';
import { Component, inject, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { VicAttributeDataDimensionConfig } from '../../geographies/config/layers/attribute-data-layer/dimensions/attribute-data-bin-types';
import { Chart } from '../chart/chart';
import { ChartComponent } from '../chart/chart.component';
import { CHART } from '../chart/chart.token';

/**
 * A `Chart` component to be used with a `Geographies` `PrimaryMarks` component.
 *
 * This component adds an attribute data scale and config to the base `ChartComponent` that can
 *  be used by any components projected into the chart.
 *
 * Components that may use these scales include the `Geographies` component
 *  and the `MapLegend` component.
 *
 * <p class="comment-slots">Content projection slots</p>
 *
 * `html-elements-before`: Elements that will be projected before the chart's scaled div
 *  and scaled svg element in the DOM. USeful for adding elements that require access to chart scales.
 *
 * `svg-defs`: Used to create any required defs for the chart's svg element. For example, patterns or gradients.
 *
 * `svg-elements`: Used for all elements that should be children of the chart's scaled svg element.
 *
 * `html-elements-after`: Elements that will be projected after the chart's scaled div
 *  and scaled svg element in the DOM. USeful for adding elements that require access to chart scales.
 */
@Component({
  selector: 'vic-map-chart',
  templateUrl: '../chart/chart.component.html',
  styleUrls: ['../chart/chart.component.scss'],
  providers: [{ provide: CHART, useExisting: ChartComponent }],
  host: {
    class: 'vic-map-chart',
  },
  imports: [CommonModule],
})
export class MapChartComponent<Datum> extends ChartComponent implements Chart {
  private attributeProperties: BehaviorSubject<{
    config: VicAttributeDataDimensionConfig<Datum>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scale: any;
  }> = new BehaviorSubject({ config: undefined, scale: undefined });
  attributeProperties$ = this.attributeProperties.asObservable();
  protected zone = inject(NgZone);

  updateAttributeProperties(properties: {
    config: VicAttributeDataDimensionConfig<Datum>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scale: any;
  }): void {
    this.zone.run(() => {
      this.attributeProperties.next({
        config: properties.config,
        scale: properties.scale,
      });
    });
  }
}

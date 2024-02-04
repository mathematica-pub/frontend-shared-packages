import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Chart } from '../chart/chart';
import { ChartComponent } from '../chart/chart.component';
import { CHART } from '../chart/chart.token';
import { VicAttributeDataDimensionConfig } from '../geographies/geographies.config';

/**
 * A `Chart` component to be used with a `Geographies` `DataMarks` component.
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
})
export class MapChartComponent<T> extends ChartComponent implements Chart {
  private attributeDataConfig: BehaviorSubject<
    VicAttributeDataDimensionConfig<T>
  > = new BehaviorSubject(null);
  attributeDataConfig$ = this.attributeDataConfig.asObservable();
  private attributeDataScale: BehaviorSubject<any> = new BehaviorSubject(null);
  attributeDataScale$ = this.attributeDataScale.asObservable();

  updateAttributeDataScale(dataScale: any): void {
    this.attributeDataScale.next(dataScale);
  }

  updateAttributeDataConfig(
    dataConfig: VicAttributeDataDimensionConfig<T>
  ): void {
    this.attributeDataConfig.next(dataConfig);
  }
}

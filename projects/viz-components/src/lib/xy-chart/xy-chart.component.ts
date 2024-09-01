/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { Chart } from '../chart/chart';
import { ChartComponent } from '../chart/chart.component';
import { CHART } from '../chart/chart.token';

export enum XyContentScale {
  x = 'x',
  y = 'y',
  categorical = 'categorical',
}

export interface GenericScale<Domain, Range> {
  (...args: any): any;
  domain?(): Domain[];
  range?(): Range[];
}

export interface XyChartScales {
  [XyContentScale.x]: GenericScale<any, any>;
  [XyContentScale.y]: GenericScale<any, any>;
  [XyContentScale.categorical]: GenericScale<any, any>;
  useTransition: boolean;
}

/**
 * A `Chart` component to be used with `DataMarks` components that have X and Y axes, such as `Bars` and `Lines`.
 *
 * This component adds x, y, and categorical scales to the base `ChartComponent` that can
 *  be used by any components projected into the chart.
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
  selector: 'vic-xy-chart',
  templateUrl: '../chart/chart.component.html',
  styleUrls: ['../chart/chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CHART, useExisting: ChartComponent }],
})
export class XyChartComponent extends ChartComponent implements Chart, OnInit {
  private scales: BehaviorSubject<XyChartScales> = new BehaviorSubject(null);
  scales$ = this.scales.asObservable().pipe(filter((scales) => !!scales));

  updateScales(scales: Partial<XyChartScales>): void {
    console.log('updateScales', scales);
    this.scales.next({ ...this.scales.value, ...scales });
  }
}

import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Chart } from '../chart/chart';
import { ChartComponent } from '../chart/chart.component';
import { CHART } from '../chart/chart.token';
import { AttributeDataDimensionConfig } from '../geographies/geographies.config';

@Component({
  selector: 'vic-map-chart',
  templateUrl: '../chart/chart.component.html',
  styleUrls: ['../chart/chart.component.scss'],
  providers: [{ provide: CHART, useExisting: ChartComponent }],
})
export class MapChartComponent extends ChartComponent implements Chart {
  attributeDataConfig: BehaviorSubject<AttributeDataDimensionConfig> =
    new BehaviorSubject(null);
  attributeDataConfig$ = this.attributeDataConfig.asObservable();
  private attributeDataScale: BehaviorSubject<any> = new BehaviorSubject(null);
  attributeDataScale$ = this.attributeDataScale.asObservable();

  updateAttributeDataScale(dataScale: any): void {
    this.attributeDataScale.next(dataScale);
  }

  updateAttributeDataConfig(dataConfig: AttributeDataDimensionConfig): void {
    this.attributeDataConfig.next(dataConfig);
  }
}

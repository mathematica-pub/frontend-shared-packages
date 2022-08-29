import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChartComponent } from '../chart/chart.component';
import { AttributeDataDimensionConfig } from '../geographies/geographies.config';

@Component({
  selector: 'vzc-map-chart',
  templateUrl: '../chart/chart.component.html',
  styleUrls: ['../chart/chart.component.scss'],
})
export class MapChartComponent extends ChartComponent {
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

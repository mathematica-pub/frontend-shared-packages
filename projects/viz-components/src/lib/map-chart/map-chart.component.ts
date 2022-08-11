import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChartComponent } from '../chart/chart.component';
import { AttributeDataDimension } from '../geographies/geographies.model';

@Component({
  selector: 'vzc-map-chart',
  templateUrl: '../chart/chart.component.html',
  styleUrls: ['../chart/chart.component.scss'],
})
export class MapChartComponent extends ChartComponent {
  attributeDataConfig: BehaviorSubject<AttributeDataDimension> =
    new BehaviorSubject(null);
  attributeDataConfig$ = this.attributeDataConfig.asObservable();
  private attributeDataScale: BehaviorSubject<any> = new BehaviorSubject(null);
  attributeDataScale$ = this.attributeDataScale.asObservable();

  updateAttributeDataScale(dataScale: any): void {
    this.attributeDataScale.next(dataScale);
  }

  updateAttributeDataConfig(dataConfig: AttributeDataDimension): void {
    this.attributeDataConfig.next(dataConfig);
  }
}

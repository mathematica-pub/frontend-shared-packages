import { NgModule } from '@angular/core';
import { ChartComponent } from './chart/chart.component';
import { MapChartComponent } from './map-chart/map-chart.component';
import { XyChartComponent } from './xy-chart/xy-chart.component';

@NgModule({
  imports: [ChartComponent, XyChartComponent, MapChartComponent],
  exports: [ChartComponent, XyChartComponent, MapChartComponent],
})
export class VicChartModule {}

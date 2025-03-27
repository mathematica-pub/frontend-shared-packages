import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MapChartComponent } from './map-chart.component';

@NgModule({
  imports: [CommonModule, MapChartComponent],
  exports: [MapChartComponent],
})
export class VicMapChartModule {}
